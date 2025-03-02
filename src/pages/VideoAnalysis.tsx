import React, { useState } from 'react';
import { FileVideo, BarChart3, AlertTriangle } from 'lucide-react';
import LocalVideoProcessor from '../components/LocalVideoProcessor';
import AlertsList from '../components/AlertsList';
import { useAlertContext } from '../context/AlertContext';
import { useAIContext } from '../context/AIContext';

const VideoAnalysis: React.FC = () => {
  const { alerts } = useAlertContext();
  const { detections } = useAIContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Filter alerts related to video analysis
  const videoAlerts = alerts.filter(alert => 
    alert.cameraId === 'video-feed' || 
    (isAnalyzing && new Date(alert.timestamp) > new Date(Date.now() - 60000))
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Video Analysis</h1>
          <p className="text-gray-400">Process and analyze security footage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <LocalVideoProcessor 
            onProcessingStart={() => setIsAnalyzing(true)}
            onProcessingEnd={() => setIsAnalyzing(false)}
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Analysis Alerts
            </h2>
          </div>
          <div>
            {videoAlerts.length > 0 ? (
              <AlertsList alerts={videoAlerts} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p>No alerts from video analysis yet</p>
                {!isAnalyzing && (
                  <p className="text-sm mt-2">Start analyzing a video to detect security events</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Analysis Results
          </h2>
        </div>
        <div className="p-4">
          {isAnalyzing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">People Detected</h3>
                <div className="text-3xl font-bold">
                  {detections.filter(d => d.type === 'person').length}
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Anomalies</h3>
                <div className="text-3xl font-bold text-yellow-500">
                  {detections.filter(d => d.isAnomaly).length}
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Confidence</h3>
                <div className="text-3xl font-bold text-green-500">
                  {detections.length > 0 
                    ? Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100) 
                    : 0}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileVideo className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p>Select a video and start analysis to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;