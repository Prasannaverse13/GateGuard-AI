import React from 'react';
import { Alert } from '../types';

interface AlertTypeChartProps {
  alerts: Alert[];
}

const AlertTypeChart: React.FC<AlertTypeChartProps> = ({ alerts }) => {
  // Count alerts by type
  const alertCounts: Record<string, number> = {};
  alerts.forEach(alert => {
    alertCounts[alert.type] = (alertCounts[alert.type] || 0) + 1;
  });
  
  // Convert to array for rendering
  const alertTypes = Object.keys(alertCounts);
  const total = alerts.length;
  
  // Colors for different alert types
  const typeColors: Record<string, string> = {
    'anomaly': 'bg-red-500',
    'intrusion': 'bg-yellow-500',
    'crowd': 'bg-blue-500',
    'access': 'bg-green-500',
    'other': 'bg-purple-500'
  };
  
  return (
    <div className="h-64 flex flex-col justify-center">
      {total === 0 ? (
        <div className="text-center text-gray-400">
          <p>No alert data available</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {alertTypes.map(type => {
              const count = alertCounts[type];
              const percentage = Math.round((count / total) * 100);
              
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${typeColors[type] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between text-xs text-gray-400">
            <div>Total Alerts: {total}</div>
            <div>Time Period: Last 7 days</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlertTypeChart;