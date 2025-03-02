import React, { createContext, useContext, useState, useEffect } from 'react';
import { getVideoUrls, getVideosFromDatabase } from '../lib/supabase';

interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  thumbnailUrl: string;
  status: 'online' | 'offline';
}

interface CameraContextType {
  cameras: Camera[];
  activeCameraId: string;
  setActiveCameraId: (id: string) => void;
  addCamera: (camera: Camera) => void;
  removeCamera: (id: string) => void;
  loading: boolean;
  refreshCameras: () => Promise<void>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCameraContext must be used within a CameraProvider');
  }
  return context;
};

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch videos from Supabase
  const fetchVideos = async () => {
    setLoading(true);
    try {
      console.log('Starting to fetch videos...');
      
      // First try to get videos from database
      let videoUrls = await getVideosFromDatabase();
      
      // If database method fails, try storage method
      if (videoUrls.length === 0) {
        console.log('No videos found in database, trying storage...');
        videoUrls = await getVideoUrls();
      }
      
      console.log('Final video URLs:', videoUrls);
      
      if (videoUrls.length > 0) {
        const supabaseCameras = videoUrls.map((video, index) => ({
          id: `supabase-cam-${index + 1}`,
          name: video.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          location: 'Security Footage',
          streamUrl: video.url,
          thumbnailUrl: video.thumbnailUrl || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          status: 'online'
        }));
        
        // No mock cameras - removed East Wing camera as requested
        
        // Set cameras to only Supabase cameras
        setCameras(supabaseCameras);
        
        // Set the first Supabase camera as active if available
        if (supabaseCameras.length > 0) {
          setActiveCameraId(supabaseCameras[0].id);
        }
      } else {
        // Fallback to empty array if no videos found in Supabase
        setCameras([]);
        setActiveCameraId('');
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
      // Fallback to empty array on error
      setCameras([]);
      setActiveCameraId('');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, []);

  const addCamera = (camera: Camera) => {
    setCameras(prevCameras => [...prevCameras, camera]);
  };

  const removeCamera = (id: string) => {
    setCameras(prevCameras => prevCameras.filter(camera => camera.id !== id));
    
    // If the active camera is removed, set the first available camera as active
    if (id === activeCameraId) {
      const remainingCameras = cameras.filter(camera => camera.id !== id);
      if (remainingCameras.length > 0) {
        setActiveCameraId(remainingCameras[0].id);
      } else {
        setActiveCameraId('');
      }
    }
  };

  // Function to manually refresh cameras
  const refreshCameras = async () => {
    await fetchVideos();
  };

  return (
    <CameraContext.Provider value={{ 
      cameras, 
      activeCameraId, 
      setActiveCameraId, 
      addCamera, 
      removeCamera, 
      loading,
      refreshCameras
    }}>
      {children}
    </CameraContext.Provider>
  );
};