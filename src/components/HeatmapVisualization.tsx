import React, { useState, useEffect } from 'react';

const HeatmapVisualization: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [heatmapPoints, setHeatmapPoints] = useState<Array<{x: number, y: number, intensity: number, size: number}>>([]);

  // Generate random heatmap data on component mount
  useEffect(() => {
    // Generate 8-12 random heatmap points
    const numPoints = Math.floor(Math.random() * 5) + 8;
    const points = [];
    
    // Create predefined hotspots for more realistic visualization
    const hotspots = [
      { x: 25, y: 25, baseIntensity: 0.8 }, // Top left room - high traffic
      { x: 75, y: 25, baseIntensity: 0.6 }, // Top right room - medium traffic
      { x: 25, y: 75, baseIntensity: 0.4 }, // Bottom left room - lower traffic
      { x: 65, y: 65, baseIntensity: 0.9 }, // Bottom right room - highest traffic
      { x: 50, y: 50, baseIntensity: 0.7 }, // Center area - medium-high traffic
    ];
    
    // Add the predefined hotspots
    hotspots.forEach(hotspot => {
      points.push({
        x: hotspot.x + (Math.random() * 10 - 5), // Add some randomness
        y: hotspot.y + (Math.random() * 10 - 5),
        intensity: hotspot.baseIntensity + (Math.random() * 0.2 - 0.1), // Randomize intensity slightly
        size: 40 + Math.random() * 30 // Larger size for main hotspots
      });
    });
    
    // Add additional random points
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * 80 + 10, // 10-90% of width
        y: Math.random() * 80 + 10, // 10-90% of height
        intensity: Math.random() * 0.7, // 0-0.7 intensity (less than main hotspots)
        size: 15 + Math.random() * 20 // Smaller size for random points
      });
    }
    
    setHeatmapPoints(points);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="relative h-64 bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-lg">
      {/* Dark background */}
      <div className="absolute inset-0 bg-gray-900"></div>
      
      {/* Floor plan grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="border border-gray-800/30"></div>
        ))}
      </div>
      
      {/* Room outlines */}
      <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] border border-gray-600/80"></div>
      <div className="absolute top-[10%] right-[10%] w-[35%] h-[35%] border border-gray-600/80"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[25%] h-[35%] border border-gray-600/80"></div>
      <div className="absolute bottom-[15%] right-[15%] w-[45%] h-[25%] border border-gray-600/80"></div>
      
      {/* Entrance markers */}
      <div className="absolute top-[50%] left-0 w-[5%] h-[10%] bg-blue-500/50 flex items-center justify-center">
        <span className="text-xs text-white font-bold">E</span>
      </div>
      <div className="absolute top-0 left-[40%] w-[10%] h-[5%] bg-blue-500/50 flex items-center justify-center">
        <span className="text-xs text-white font-bold">E</span>
      </div>
      
      {/* Heatmap points */}
      {heatmapPoints.map((point, index) => {
        const opacity = 0.4 + (point.intensity * 0.5); // 0.4-0.9 opacity
        
        let color;
        if (point.intensity > 0.7) {
          color = 'bg-red-500';
        } else if (point.intensity > 0.4) {
          color = 'bg-yellow-500';
        } else {
          color = 'bg-green-500';
        }
        
        return (
          <div 
            key={index}
            className={`absolute rounded-full ${color} blur-xl`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
              opacity: opacity,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        );
      })}
      
      {/* Room labels */}
      <div className="absolute top-[15%] left-[15%] text-xs text-white/70">Meeting Room</div>
      <div className="absolute top-[15%] right-[15%] text-xs text-white/70">Office Area</div>
      <div className="absolute bottom-[25%] left-[15%] text-xs text-white/70">Storage</div>
      <div className="absolute bottom-[25%] right-[25%] text-xs text-white/70">Main Hall</div>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex space-x-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 opacity-70 rounded-full mr-1"></div>
          <span>High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 opacity-70 rounded-full mr-1"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 opacity-70 rounded-full mr-1"></div>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVisualization;