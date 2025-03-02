import React, { useState, useEffect, useRef } from 'react';
import { Camera, Users, AlertTriangle, Eye, Settings, Loader, RefreshCw, Cpu } from 'lucide-react';
import { useCameraContext } from '../context/CameraContext';
import { useAIContext } from '../context/AIContext';
import CameraGrid from '../components/CameraGrid';
import AIControlPanel from '../components/AIControlPanel';
import DetectionOverlay from '../components/DetectionOverlay';
import CameraPreview from '../components/CameraPreview';
import DemographicAnalysis from '../components/DemographicAnalysis';

const LiveMonitoring: React.FC = () => {
  const { cameras, activeCameraId, setActiveCameraId, loading, refreshCameras } = useCameraContext();
  const { detections, processingEnabled, toggleProcessing, sensitivity, setSensitivity } = useAIContext();
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('single');
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);

  // Get active camera details
  const activeCamera = cameras.find(cam => cam.id === activeCameraId) || cameras[0];
  const isSupabaseCamera = activeCamera?.id.startsWith('supabase-cam');
  const isHallCrowdCamera = activeCamera?.name.toLowerCase().includes('hall crowd');

  // Count special detections
  const specialDetections = detections.filter(d => 
    (d.type === 'smoke' || d.type === 'fire' || d.type === 'crowd_dispersal') && 
    d.cameraId === activeCameraId
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCameras();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-xl">Loading camera feeds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Live Monitoring</h1>
          <p className="text-gray-400">Real-time video feeds with AI detection</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
              viewMode === 'single' ? 'gradient-button' : 'glass-panel hover:bg-gray-800/70'
            }`}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span>Single View</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
              viewMode === 'grid' ? 'gradient-button' : 'glass-panel hover:bg-gray-800/70'
            }`}
          >
            <Camera className="h-4 w-4 mr-1" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
              showSettings ? 'gradient-button' : 'glass-panel hover:bg-gray-800/70'
            }`}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span>AI Settings</span>
          </button>
          <button
            onClick={() => setShowDemographics(!showDemographics)}
            className={`px-3 py-1.5 rounded-lg flex items-center transition-all ${
              showDemographics ? 'gradient-button' : 'glass-panel hover:bg-gray-800/70'
            }`}
          >
            <Users className="h-4 w-4 mr-1" />
            <span>Demographics</span>
          </button>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 glass-panel rounded-lg flex items-center hover:bg-gray-800/70 transition-all"
            title="Refresh cameras"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Special detection alerts - now as a notification banner instead of full-screen overlay */}
      {specialDetections.length > 0 && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg flex items-center ${
            specialDetections.some(d => d.type === 'fire') 
              ? 'bg-red-900/30 backdrop-blur-md border border-red-800/50' 
              : specialDetections.some(d => d.type === 'smoke')
                ? 'bg-gray-800/80 backdrop-blur-md border border-gray-700'
                : 'bg-yellow-900/30 backdrop-blur-md border border-yellow-800/50'
          }`}>
            <AlertTriangle className="h-6 w-6 mr-3 text-red-400" />
            <div>
              <h3 className="font-medium">
                {specialDetections.some(d => d.type === 'fire') 
                  ? 'Fire Detected!' 
                  : specialDetections.some(d => d.type === 'smoke')
                    ? 'Smoke Detected!'
                    : 'Crowd Dispersal Detected!'}
              </h3>
              <p className="text-sm text-gray-300">
                {specialDetections.some(d => d.type === 'fire') 
                  ? 'Potential fire detected in camera feed. Please verify and take appropriate action.' 
                  : specialDetections.some(d => d.type === 'smoke')
                    ? 'Potential smoke detected in camera feed. Please verify and take appropriate action.'
                    : 'Unusual crowd movement detected. People are dispersing rapidly.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`${viewMode === 'single' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {viewMode === 'single' ? (
            <div className="bento-card overflow-hidden">
              <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
                <div className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-blue-500" />
                  <h2 className="font-semibold">{activeCamera?.name || 'Camera Feed'}</h2>
                  {isHallCrowdCamera && (
                    <span className="ml-2 text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded">
                      AI Disabled for this camera
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${activeCamera?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-400">{activeCamera?.status === 'online' ? (isSupabaseCamera ? 'Video' : 'Live') : 'Offline'}</span>
                </div>
              </div>
              <div className="p-4">
                <CameraPreview cameraId={activeCameraId} />
              </div>
              <div className="p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-500" />
                      <span>People detected: {detections.filter(d => d.cameraId === activeCameraId && d.type === 'person').length}</span>
                    </div>
                    <div className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Faces detected: {detections.filter(d => d.cameraId === activeCameraId && d.type === 'face').length}</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Anomalies: {detections.filter(d => d.cameraId === activeCameraId && d.isAnomaly).length}</span>
                    </div>
                  </div>
                  <div>
                    <button 
                      className={`px-3 py-1.5 rounded-lg transition-all ${processingEnabled ? 'bg-red-600 hover:bg-red-700' : 'gradient-button'}`}
                      onClick={toggleProcessing}
                      disabled={isHallCrowdCamera}
                      title={isHallCrowdCamera ? "AI processing disabled for Hall Crowd camera" : ""}
                    >
                      {processingEnabled ? 'Pause AI' : 'Start AI'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CameraGrid 
              cameras={cameras} 
              activeCameraId={activeCameraId}
              setActiveCameraId={setActiveCameraId}
              detections={detections}
            />
          )}
        </div>

        {viewMode === 'single' && (
          <div className="lg:col-span-1">
            <div className="bento-card overflow-hidden">
              <div className="p-4 border-b border-gray-800/50">
                <h2 className="font-semibold">Camera Selection</h2>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    className={`w-full text-left mb-3 p-2 rounded-lg flex items-center transition-all ${
                      camera.id === activeCameraId ? 'bg-blue-900/30 border border-blue-500/30 shadow-glow-blue' : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setActiveCameraId(camera.id)}
                  >
                    <div className="w-16 h-12 mr-3 relative flex-shrink-0 bg-black rounded-lg overflow-hidden">
                      {camera.id.startsWith('supabase-cam') ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <img 
                            src={`https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/public/thumbnails/${camera.name.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
                            alt={camera.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={camera.thumbnailUrl}
                          alt={camera.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                        camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div>
                      <div className="font-medium">{camera.name}</div>
                      <div className="text-xs text-gray-400">{camera.location}</div>
                      {camera.name.toLowerCase().includes('hall crowd') && (
                        <div className="text-xs text-yellow-400 mt-1">AI Disabled</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {showSettings && (
              <div className="mt-6 bento-card overflow-hidden">
                <div className="p-4 border-b border-gray-800/50">
                  <h2 className="font-semibold">AI Settings</h2>
                </div>
                <div className="p-4">
                  <AIControlPanel 
                    processingEnabled={processingEnabled}
                    toggleProcessing={toggleProcessing}
                    sensitivity={sensitivity}
                    setSensitivity={setSensitivity}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Demographic Analysis */}
      {showDemographics && (
        <div className="mt-6">
          <DemographicAnalysis />
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;