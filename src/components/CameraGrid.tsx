import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertTriangle, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Detection } from '../types';
import DetectionOverlay from './DetectionOverlay';
import { useCameraContext } from '../context/CameraContext';

interface CameraGridProps {
  cameras: Array<{
    id: string;
    name: string;
    streamUrl: string;
    thumbnailUrl: string;
    location: string;
    status: string;
  }>;
  activeCameraId: string;
  setActiveCameraId: (id: string) => void;
  detections: Detection[];
}

const CameraGrid: React.FC<CameraGridProps> = ({ 
  cameras, 
  activeCameraId, 
  setActiveCameraId,
  detections
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [videoErrors, setVideoErrors] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState(true);
  const { refreshCameras } = useCameraContext();
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});
  const [videoKeys, setVideoKeys] = useState<{[key: string]: number}>({}); // For forcing re-renders

  // Check if camera is from Supabase
  const isSupabaseCamera = (id: string) => id.startsWith('supabase-cam');
  
  // Check if camera is Hall Crowd
  const isHallCrowdCamera = (name: string) => name.toLowerCase().includes('hall crowd');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCameras();
    setVideoErrors({});
    
    // Force re-render of all videos
    const newKeys: {[key: string]: number} = {};
    cameras.forEach(camera => {
      newKeys[camera.id] = Date.now() + Math.random();
    });
    setVideoKeys(newKeys);
    
    setIsRefreshing(false);
  };

  // Initialize video keys when cameras change
  useEffect(() => {
    const newKeys: {[key: string]: number} = {};
    cameras.forEach(camera => {
      if (!videoKeys[camera.id]) {
        newKeys[camera.id] = Date.now() + Math.random();
      }
    });
    if (Object.keys(newKeys).length > 0) {
      setVideoKeys(prev => ({...prev, ...newKeys}));
    }
  }, [cameras]);

  return (
    <div className="bento-card overflow-hidden">
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center">
          <Camera className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="font-semibold">Camera Grid View</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Showing {cameras.length} cameras
          </div>
          <button 
            onClick={handleRefresh}
            className="p-1.5 bg-gray-800/70 backdrop-blur-sm rounded-full hover:bg-gray-700/70 flex items-center justify-center transition-all"
            title="Refresh cameras"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera) => {
          const isSupabase = isSupabaseCamera(camera.id);
          const isHallCrowd = isHallCrowdCamera(camera.name);
          const hasError = videoErrors[camera.id];
          
          // Get special detections for this camera
          const specialDetections = detections.filter(d => 
            d.cameraId === camera.id && 
            (d.type === 'smoke' || d.type === 'fire' || d.type === 'crowd_dispersal')
          );
          
          return (
            <div 
              key={camera.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all camera-feed ${
                camera.id === activeCameraId ? 'ring-2 ring-blue-500 shadow-glow-blue' : 'hover:opacity-90'
              }`}
              onClick={() => setActiveCameraId(camera.id)}
            >
              <div className="relative">
                {isSupabase ? (
                  hasError ? (
                    <div className="w-full h-48 bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                      <span className="text-sm text-gray-400">Video error</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-black">
                      <video 
                        key={videoKeys[camera.id] || Date.now()} // Force re-render when needed
                        ref={el => videoRefs.current[camera.id] = el}
                        className="w-full h-48 object-contain bg-black"
                        muted={isMuted}
                        loop
                        autoPlay
                        playsInline
                        src={camera.streamUrl}
                        onError={() => setVideoErrors(prev => ({ ...prev, [camera.id]: true }))}
                      />
                    </div>
                  )
                ) : (
                  <img 
                    src={camera.streamUrl || camera.thumbnailUrl} 
                    alt={camera.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                {/* Only show detections for non-Hall Crowd cameras */}
                {!isHallCrowd && (
                  <DetectionOverlay 
                    detections={detections.filter(d => d.cameraId === camera.id)} 
                    cameraId={camera.id}
                    compact
                  />
                )}
                
                {/* Special detection alerts - now as non-intrusive notifications */}
                {specialDetections.length > 0 && (
                  <div className="absolute top-2 left-2 right-2 bg-red-500/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md animate-pulse-glow flex items-center justify-center z-20">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {specialDetections[0].type === 'smoke' ? 'Smoke Detected!' : 
                     specialDetections[0].type === 'fire' ? 'Fire Detected!' : 
                     'Crowd Dispersal Detected!'}
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">
                        {camera.name}
                        {isHallCrowd && (
                          <span className="ml-1 text-xs text-yellow-400">(AI Disabled)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">{camera.location}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      hasError ? 'bg-red-500' : 
                      camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CameraGrid;