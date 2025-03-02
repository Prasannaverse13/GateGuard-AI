import React, { useState, useEffect, useRef } from 'react';
import { useCameraContext } from '../context/CameraContext';
import { useAIContext } from '../context/AIContext';
import DetectionOverlay from './DetectionOverlay';
import FaceDetectionProcessor from './FaceDetectionProcessor';
import { RefreshCw, Camera, AlertTriangle, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CameraPreviewProps {
  cameraId: string;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ cameraId }) => {
  const { cameras, refreshCameras } = useCameraContext();
  const { detections, processingEnabled } = useAIContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoKey, setVideoKey] = useState(Date.now()); // Force re-render of video element

  const camera = cameras.find(cam => cam.id === cameraId);
  const isSupabaseCamera = camera?.id.startsWith('supabase-cam');
  const isHallCrowdCamera = camera?.name?.toLowerCase().includes('hall crowd');

  // Load the video when camera changes
  useEffect(() => {
    if (!camera || !isSupabaseCamera) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoKey(Date.now()); // Force video element to re-render with new source
    console.log(`Loading video for camera ${camera.id}: ${camera.streamUrl}`);
  }, [camera, isSupabaseCamera]);

  // Handle video events
  const handleVideoLoaded = () => {
    console.log(`Video loaded successfully for ${camera?.id}`);
    setIsLoading(false);
    
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error('Error playing video after load:', e);
      });
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Error loading video for ${camera?.id}:`, e);
    setError('Error loading video. Please try refreshing or select a different camera.');
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCameras();
    setVideoKey(Date.now()); // Force video element to re-render
    setIsLoading(true);
    setError(null);
    setIsRefreshing(false);
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => {
          console.error('Error playing video:', e);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  if (error) {
    return (
      <div className="glass-panel p-8 flex items-center justify-center h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <div className="text-red-500 mb-2">Error: {error}</div>
          <p className="text-gray-400 mb-4">Please select a different camera or check your connection.</p>
          <button 
            onClick={handleRefresh}
            className="gradient-button px-4 py-2 flex items-center mx-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Cameras
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-panel p-8 flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading camera feed...</p>
          {isSupabaseCamera && (
            <p className="text-gray-500 text-sm mt-2">This may take a moment if the video is large</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Face Detection Processor - only show for non-Hall Crowd cameras */}
      {isSupabaseCamera && processingEnabled && !isHallCrowdCamera && (
        <FaceDetectionProcessor cameraId={cameraId} videoRef={videoRef} />
      )}
      
      <div className="relative camera-feed">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{height: '400px'}}>
          {isSupabaseCamera ? (
            <video 
              key={videoKey} // Force re-render when camera changes
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              muted={isMuted}
              loop
              autoPlay
              playsInline
              controls={false}
              src={camera?.streamUrl}
              onLoadedData={handleVideoLoaded}
              onError={handleVideoError}
            />
          ) : (
            <img 
              src={camera?.streamUrl || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80'} 
              alt={camera?.name || 'Camera Feed'} 
              className="w-full h-full object-cover"
            />
          )}
          
          <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
            <button
              onClick={toggleMute}
              className="p-2 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-all"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              onClick={togglePlayback}
              className="p-2 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Only show detections for non-Hall Crowd cameras */}
        {!isHallCrowdCamera && (
          <DetectionOverlay 
            detections={detections.filter(d => d.cameraId === cameraId)} 
            cameraId={cameraId}
          />
        )}
        
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs z-10">
          {camera?.name || 'Camera Feed'} • {isSupabaseCamera ? 'Video' : 'Live'}
          {isHallCrowdCamera && (
            <span className="ml-2 text-yellow-400">(AI Disabled)</span>
          )}
        </div>
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleRefresh}
            className="p-2 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-all"
            title="Refresh video"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;