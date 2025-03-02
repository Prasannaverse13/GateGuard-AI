import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, FileVideo, Shield, AlertTriangle } from 'lucide-react';
import { useAIContext } from '../context/AIContext';
import { useAlertContext } from '../context/AlertContext';
import { Detection } from '../types';

interface LocalVideoProcessorProps {
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

const LocalVideoProcessor: React.FC<LocalVideoProcessorProps> = ({ 
  onProcessingStart, 
  onProcessingEnd 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const { toggleProcessing, detections, sensitivity } = useAIContext();
  const { addAlert } = useAlertContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setError("File is too large. Maximum size is 100MB.");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        setError("Please select a video file.");
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
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
    if (!videoUrl) return;
    
    setIsProcessing(true);
    onProcessingStart();
    
    // Start video playback
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
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
    
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
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
    simulateAIDetection(canvas);
    
    // Calculate progress
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      setProcessingProgress(progress);
    }
    
    // Continue processing if video is still playing
    if (!video.paused && !video.ended) {
      animationRef.current = requestAnimationFrame(processFrame);
    } else {
      stopProcessing();
    }
  };

  const simulateAIDetection = (canvas: HTMLCanvasElement) => {
    // This is where you would normally send the frame to an AI model
    // For the hackathon demo, we'll simulate detections based on video timing
    
    const video = videoRef.current;
    if (!video) return;
    
    // Generate a detection every few seconds
    if (Math.random() < sensitivity / 500) {
      // Simulate person detection
      const newDetection: Detection = {
        id: `detection-${Date.now()}-${Math.random()}`,
        cameraId: 'video-feed',
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
          description: 'Suspicious behavior detected in video feed',
          type: 'anomaly',
          severity: 'high',
          cameraId: 'video-feed',
          cameraName: 'Video Analysis',
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [videoUrl]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <FileVideo className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="font-semibold">Video Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="text-sm text-gray-400">
              Processing: {Math.round(processingProgress)}%
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {!videoUrl ? (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <FileVideo className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="mb-4 text-gray-400">Select a video file to analyze</p>
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer">
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <span className="flex items-center justify-center">
                <FileVideo className="h-4 w-4 mr-2" />
                Select Video
              </span>
            </label>
            {error && (
              <p className="mt-4 text-red-500 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="relative">
              <video 
                ref={videoRef}
                src={videoUrl}
                className="w-full h-auto rounded-lg"
                onEnded={() => {
                  setIsPlaying(false);
                  if (isProcessing) {
                    stopProcessing();
                  }
                }}
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden"
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
                  setSelectedFile(null);
                  setVideoUrl(null);
                  setIsPlaying(false);
                  if (isProcessing) {
                    stopProcessing();
                  }
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Select Different Video
              </button>
              
              {!isProcessing ? (
                <button
                  onClick={startProcessing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
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
        )}
      </div>
    </div>
  );
};

export default LocalVideoProcessor;