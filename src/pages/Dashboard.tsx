import React, { useState, useEffect, useRef } from 'react';
import { Camera, Users, AlertTriangle, Activity, Clock, Loader, RefreshCw, Flame, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from '../context/AlertContext';
import { useCameraContext } from '../context/CameraContext';
import { useAIContext } from '../context/AIContext';
import StatCard from '../components/StatCard';
import AlertsList from '../components/AlertsList';
import CrowdDensityChart from '../components/CrowdDensityChart';
import HeatmapVisualization from '../components/HeatmapVisualization';
import DemographicAnalysis from '../components/DemographicAnalysis';

const Dashboard: React.FC = () => {
  const { alerts } = useAlertContext();
  const { cameras, loading, refreshCameras } = useCameraContext();
  const { detections } = useAIContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const clockTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Count special detections
  const smokeDetections = detections.filter(d => d.type === 'smoke').length;
  const fireDetections = detections.filter(d => d.type === 'fire').length;
  const crowdDispersalDetections = detections.filter(d => d.type === 'crowd_dispersal').length;

  useEffect(() => {
    // Using window.setTimeout for better browser compatibility
    const updateClock = () => {
      setCurrentTime(new Date());
      clockTimerRef.current = window.setTimeout(updateClock, 1000);
    };
    
    updateClock();
    
    return () => {
      if (clockTimerRef.current !== null) {
        window.clearTimeout(clockTimerRef.current);
      }
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCameras();
    setIsRefreshing(false);
  };

  const recentAlerts = alerts.slice(0, 5);
  
  // Mock data for the dashboard
  const stats = [
    { 
      title: 'Active Cameras', 
      value: cameras.length, 
      icon: <Camera className="h-6 w-6 text-blue-500" />,
      change: '+2 from yesterday',
      trend: 'up'
    },
    { 
      title: 'Current Visitors', 
      value: 342, 
      icon: <Users className="h-6 w-6 text-green-500" />,
      change: '+18% from average',
      trend: 'up'
    },
    { 
      title: 'Alerts Today', 
      value: alerts.length, 
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      change: '-5% from yesterday',
      trend: 'down'
    },
    { 
      title: 'System Status', 
      value: 'Optimal', 
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      change: '99.8% uptime',
      trend: 'neutral'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-xl">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Security Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring and analytics</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center text-gray-400 mr-4 glass-panel px-3 py-1">
            <Clock className="h-5 w-5 mr-2" />
            <span>{currentTime.toLocaleString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 glass-panel rounded-full hover:bg-gray-800/70 flex items-center justify-center transition-all"
            title="Refresh dashboard"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Special detection alerts */}
      {(smokeDetections > 0 || fireDetections > 0 || crowdDispersalDetections > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {smokeDetections > 0 && (
            <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg p-4 flex items-center animate-pulse-glow">
              <div className="p-3 bg-gray-700/50 rounded-full mr-4">
                <Wind className="h-6 w-6 text-gray-300" />
              </div>
              <div>
                <h3 className="font-medium">Smoke Detected</h3>
                <p className="text-sm text-gray-400">Potential smoke detected in {smokeDetections} camera(s)</p>
              </div>
            </div>
          )}
          
          {fireDetections > 0 && (
            <div className="bg-red-900/30 backdrop-blur-md border border-red-800/50 rounded-lg p-4 flex items-center animate-pulse-glow">
              <div className="p-3 bg-red-800/30 rounded-full mr-4">
                <Flame className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-200">Fire Detected</h3>
                <p className="text-sm text-red-300/70">Potential fire detected in {fireDetections} camera(s)</p>
              </div>
            </div>
          )}
          
          {crowdDispersalDetections > 0 && (
            <div className="bg-yellow-900/30 backdrop-blur-md border border-yellow-800/50 rounded-lg p-4 flex items-center animate-pulse-glow">
              <div className="p-3 bg-yellow-800/30 rounded-full mr-4">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-200">Crowd Dispersal</h3>
                <p className="text-sm text-yellow-300/70">Unusual crowd movement in {crowdDispersalDetections} camera(s)</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bento-grid grid-cols-1 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 bento-card overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="font-semibold">Analytics Overview</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Today's Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Visitors</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Peak Time</span>
                    <span className="font-medium">2:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Dwell Time</span>
                    <span className="font-medium">24 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Security Events</span>
                    <span className="font-medium">{alerts.length}</span>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">System Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">CPU Usage</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Memory</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Storage</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/live-monitoring')}
                className="gradient-button px-4 py-2 rounded-lg inline-flex items-center"
              >
                <Camera className="h-4 w-4 mr-2" />
                Go to Live Monitoring
              </button>
            </div>
          </div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="font-semibold">Recent Alerts</h2>
          </div>
          <div className="p-4">
            <AlertsList alerts={recentAlerts} compact />
          </div>
        </div>
      </div>

      <div className="bento-grid grid-cols-1 lg:grid-cols-2 mb-6">
        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="font-semibold">Crowd Density Over Time</h2>
          </div>
          <div className="p-4">
            <CrowdDensityChart />
          </div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="font-semibold">Crowd Heatmap</h2>
          </div>
          <div className="p-4">
            <HeatmapVisualization />
          </div>
        </div>
      </div>
      
      {/* Demographic Analysis */}
      <DemographicAnalysis />
    </div>
  );
};

export default Dashboard;