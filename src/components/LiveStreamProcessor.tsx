import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Link, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAIContext } from '../context/AIContext';
import { useAlertContext } from '../context/AlertContext';
import { Detection } from '../types';
import DetectionOverlay from './DetectionOverlay';

interface LiveStreamProcessorProps {
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

const LiveStreamProcessor: React.FC<LiveStreamProcessorProps> = ({ 
  onProcessingStart, 
  onProcessingEnd 
}) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const { detections, sensitivity } = useAIContext();
  const { addAlert } = useAlertContext();
  
  const cameraId = 'live-stream';
  const streamDetections = detections.filter(d => d.cameraId === cameraId);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputUrl) {
      setError("Please enter a valid video URL");
      return;
    }
    
    // Check if URL is valid
    try {
      new URL(inputUrl);
    } catch (e) {
      setError("Please enter a valid URL");
      return;
    }
    
    setError(null);
    setStreamUrl(inputUrl);
    setIsLoading(true);
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startProcessing = () => {
    if (!streamUrl) return;
    
    setIsProcessing(true);
    onProcessingStart();
    
    // Start video playback
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
    
    // Start AI processing
    processFrame();
  };

  const stopProcessing = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsProcessing(false);
    onProcessingEnd();
  };

  const processFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simulate AI processing
    simulateAIDetection();
    
    // Continue processing if video is still playing
    if (!video.paused && !video.ended) {
      animationRef.current = requestAnimationFrame(processFrame);
    } else {
      stopProcessing();
    }
  };

  const simulateAIDetection = () => {
    // Generate a detection based on sensitivity
    if (Math.random() < sensitivity / 500) {
      // Simulate person detection
      const newDetection: Detection = {
        id: `detection-${Date.now()}-${Math.random()}`,
        cameraId: cameraId,
        type: 'person',
        label: Math.random() > 0.8 ? 'Suspicious Person' : 'Person',
        confidence: 0.7 + (Math.random() * 0.3),
        boundingBox: {
          x: Math.random() * 0.7,
          y: Math.random() * 0.7,
          width: Math.random() * 0.2 + 0.1,
          height: Math.random() * 0.3 + 0.2
        },
        isAnomaly: Math.random() > 0.9,
        timestamp: new Date().toISOString()
      };
      
      // Generate an alert for anomalies
      if (newDetection.isAnomaly) {
        addAlert({
          id: `alert-${Date.now()}`,
          title: 'Anomaly Detected',
          description: 'Suspicious behavior detected in live stream',
          type: 'anomaly',
          severity: 'high',
          cameraId: cameraId,
          cameraName: 'Live Stream',
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      }
    }
  };

  // Handle video loading events
  useEffect(() => {
    if (!videoRef.current) return;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError("Error loading video. Please check the URL and try again.");
    };
    
    const video = videoRef.current;
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [streamUrl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Link className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="font-semibold">Live Stream Monitoring</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="text-sm text-green-500 flex items-center">
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              AI Processing Active
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleUrlSubmit} className="mb-4">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter video stream URL (Google Drive, direct MP4, etc.)"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <Link className="h-4 w-4 mr-2" />
              Connect Stream
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
        </form>

        {streamUrl ? (
          <div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading stream...</p>
                  </div>
                </div>
              )}
              
              <video 
                ref={videoRef}
                src={streamUrl}
                className="w-full h-auto rounded-lg"
                onEnded={() => {
                  setIsPlaying(false);
                  if (isProcessing) {
                    stopProcessing();
                  }
                }}
                controls={false}
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden"
              />
              
              <DetectionOverlay 
                detections={streamDetections} 
                cameraId={cameraId}
              />
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={togglePlayback}
                  className="p-2 bg-gray-900 bg-opacity-70 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setStreamUrl('');
                  setIsPlaying(false);
                  if (isProcessing) {
                    stopProcessing();
                  }
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Change Stream
              </button>
              
              {!isProcessing ? (
                <button
                  onClick={startProcessing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                  disabled={isLoading}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Start AI Analysis
                </button>
              ) : (
                <button
                  onClick={stopProcessing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Stop Analysis
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <Link className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="mb-4 text-gray-400">Enter a video stream URL to begin monitoring</p>
            <p className="text-sm text-gray-500">
              Supports Google Drive shared videos, direct MP4 links, and other video stream URLs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamProcessor;