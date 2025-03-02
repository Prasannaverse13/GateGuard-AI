import React from 'react';
import { AlertTriangle, Camera, Clock, ChevronRight } from 'lucide-react';
import { Alert } from '../types';

interface AlertsListProps {
  alerts: Alert[];
  compact?: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, compact = false }) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-500" />
        <p>No alerts to display</p>
      </div>
    );
  }

  return (
    <div className={`divide-y divide-gray-800/50 ${compact ? '' : 'max-h-[500px] overflow-y-auto'}`}>
      {alerts.map((alert) => (
        <div key={alert.id} className="p-4 hover:bg-gray-800/50 transition-colors backdrop-blur-sm">
          <div className="flex items-start">
            <div className={`flex-shrink-0 mr-3 mt-1 ${
              alert.severity === 'high' ? 'text-red-500' :
              alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium truncate">{alert.title}</p>
                <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {!compact && (
                <p className="mt-1 text-sm text-gray-400">{alert.description}</p>
              )}
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Camera className="h-3 w-3 mr-1" />
                <span className="truncate">{alert.cameraName}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
            {!compact && (
              <div className="ml-3 flex-shrink-0">
                <button className="p-1 rounded-full hover:bg-gray-700/70 transition-colors">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;