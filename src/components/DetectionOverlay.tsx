import React from 'react';
import { Detection } from '../types';
import { AlertTriangle, Flame, Wind } from 'lucide-react';

interface DetectionOverlayProps {
  detections: Detection[];
  cameraId: string;
  compact?: boolean;
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detections, cameraId, compact = false }) => {
  const cameraDetections = detections.filter(d => d.cameraId === cameraId);
  
  // Check for special detection types
  const hasSmoke = cameraDetections.some(d => d.type === 'smoke');
  const hasFire = cameraDetections.some(d => d.type === 'fire');
  const hasCrowdDispersal = cameraDetections.some(d => d.type === 'crowd_dispersal');
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {cameraDetections.map((detection) => {
        // Skip rendering special detections differently
        if (detection.type === 'smoke' || detection.type === 'fire' || detection.type === 'crowd_dispersal') {
          return null;
        }
        
        // Convert normalized coordinates to pixel values
        // In a real app, these would be calculated based on the actual video dimensions
        const x = detection.boundingBox.x * 100;
        const y = detection.boundingBox.y * 100;
        const width = detection.boundingBox.width * 100;
        const height = detection.boundingBox.height * 100;
        
        // Different colors for different detection types
        let boxColor = 'border-green-500';
        let labelColor = 'bg-green-500/80';
        let animationClass = '';
        
        if (detection.isAnomaly) {
          boxColor = 'border-red-500';
          labelColor = 'bg-red-500/80';
          animationClass = 'animate-pulse';
        } else if (detection.type === 'face') {
          boxColor = 'border-blue-500';
          labelColor = 'bg-blue-500/80';
        }
        
        return (
          <div 
            key={detection.id}
            className={`absolute border-2 ${boxColor} ${compact ? 'border-opacity-70' : ''} detection-box ${detection.isAnomaly ? 'anomaly' : ''} backdrop-blur-xs ${animationClass}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}%`,
              height: `${height}%`
            }}
          >
            {!compact && (
              <div className={`absolute -top-6 left-0 ${labelColor} text-white text-xs px-1 py-0.5 rounded-sm backdrop-blur-sm`}>
                {detection.isAnomaly ? 'ALERT: ' : ''}{detection.label} ({Math.round(detection.confidence * 100)}%)
              </div>
            )}
            
            {/* Draw landmarks for face detections */}
            {detection.type === 'face' && detection.landmarks && !compact && (
              <div className="absolute inset-0">
                {detection.landmarks.map((landmark, i) => {
                  // Convert normalized landmark coordinates to percentages
                  const lx = ((landmark[0] / 100) - detection.boundingBox.x) / detection.boundingBox.width * 100;
                  const ly = ((landmark[1] / 100) - detection.boundingBox.y) / detection.boundingBox.height * 100;
                  
                  return (
                    <div 
                      key={`landmark-${i}`}
                      className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                      style={{
                        left: `${lx}%`,
                        top: `${ly}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Special detection alerts - now as non-intrusive notifications */}
      {hasSmoke && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center animate-pulse-glow z-20">
          <Wind className="h-5 w-5 mr-2 text-gray-300" />
          <span className="font-bold">Smoke Detected</span>
        </div>
      )}
      
      {hasFire && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center animate-pulse-glow z-20">
          <Flame className="h-5 w-5 mr-2 text-red-400" />
          <span className="font-bold">Fire Detected</span>
        </div>
      )}
      
      {hasCrowdDispersal && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center animate-pulse-glow z-20">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-bold">Crowd Dispersal</span>
        </div>
      )}
      
      {cameraDetections.some(d => d.isAnomaly) && !hasSmoke && !hasFire && !hasCrowdDispersal && (
        <div className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md animate-pulse-glow">
          Anomaly Detected
        </div>
      )}
      
      {cameraDetections.filter(d => d.type === 'face').length > 0 && (
        <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md">
          Faces: {cameraDetections.filter(d => d.type === 'face').length}
        </div>
      )}
    </div>
  );
};

export default DetectionOverlay;