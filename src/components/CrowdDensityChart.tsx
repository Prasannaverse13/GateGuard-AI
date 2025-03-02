import React, { useState, useEffect } from 'react';

const CrowdDensityChart: React.FC = () => {
  const [crowdData, setCrowdData] = useState<number[]>([]);
  
  // Generate a realistic crowd pattern with morning and evening peaks
  useEffect(() => {
    const generateData = () => {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map(hour => {
        // Morning peak (8-10 AM)
        if (hour >= 8 && hour <= 10) {
          return 50 + Math.floor(Math.random() * 40);
        }
        // Lunch peak (12-2 PM)
        else if (hour >= 12 && hour <= 14) {
          return 60 + Math.floor(Math.random() * 30);
        }
        // Evening peak (5-7 PM)
        else if (hour >= 17 && hour <= 19) {
          return 70 + Math.floor(Math.random() * 30);
        }
        // Late night (10 PM - 6 AM)
        else if (hour >= 22 || hour <= 6) {
          return 5 + Math.floor(Math.random() * 15);
        }
        // Other times
        else {
          return 20 + Math.floor(Math.random() * 30);
        }
      });
    };
    
    setCrowdData(generateData());
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const maxValue = Math.max(...crowdData, 1);
  
  // Calculate the current hour
  const currentHour = new Date().getHours();

  if (crowdData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <div className="flex items-end h-48 space-x-1">
        {hours.map((hour, index) => {
          // Ensure we have valid data
          if (index >= crowdData.length) return null;
          
          // Calculate height percentage with a minimum to ensure visibility
          const height = Math.max((crowdData[index] / maxValue) * 100, 5);
          
          return (
            <div 
              key={hour} 
              className="flex-1 flex flex-col items-center"
            >
              <div 
                className={`w-full rounded-t ${
                  hour === currentHour 
                    ? 'bg-blue-500' 
                    : crowdData[index] > 70 
                      ? 'bg-red-500' 
                      : crowdData[index] > 40 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                }`}
                style={{ height: `${height}%` }}
              >
                {(hour === currentHour || crowdData[index] > 70) && (
                  <div className="text-xs text-center text-white font-bold mt-1">
                    {crowdData[index]}
                  </div>
                )}
              </div>
              {(hour % 3 === 0 || hour === currentHour) && (
                <div className={`text-xs mt-1 ${hour === currentHour ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
                  {hour}:00
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default CrowdDensityChart;