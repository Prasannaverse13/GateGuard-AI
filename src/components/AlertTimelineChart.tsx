import React from 'react';
import { Alert } from '../types';

interface AlertTimelineChartProps {
  alerts: Alert[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

const AlertTimelineChart: React.FC<AlertTimelineChartProps> = ({ alerts, dateRange }) => {
  // Group alerts by day
  const days = 7; // Show last 7 days
  const dayLabels: string[] = [];
  const alertsByDay: number[] = [];
  
  // Generate day labels and initialize counts
  for (let i = 0; i < days; i++) {
    const date = new Date(dateRange.end);
    date.setDate(date.getDate() - (days - 1 - i));
    dayLabels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    alertsByDay.push(0);
  }
  
  // Count alerts for each day
  alerts.forEach(alert => {
    const alertDate = new Date(alert.timestamp);
    const daysDiff = Math.floor((dateRange.end.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff < days) {
      alertsByDay[days - 1 - daysDiff]++;
    }
  });
  
  const maxAlerts = Math.max(...alertsByDay, 1);
  
  return (
    <div className="h-64">
      <div className="flex items-end h-48 space-x-2">
        {alertsByDay.map((count, index) => {
          const height = (count / maxAlerts) * 100;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center"
            >
              <div 
                className={`w-full rounded-t ${
                  count > (maxAlerts * 0.7) 
                    ? 'bg-red-500' 
                    : count > (maxAlerts * 0.3) 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                }`}
                style={{ height: `${height}%` }}
              >
                {count > 0 && (
                  <div className="text-xs text-center text-white font-bold mt-1">
                    {count}
                  </div>
                )}
              </div>
              <div className="text-xs mt-2 text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                {dayLabels[index]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertTimelineChart;