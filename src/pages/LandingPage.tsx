import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertTriangle, Users, BarChart3, ShieldCheck } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-16 glow-effect">
          <div className="relative mb-6">
            <ShieldCheck className="h-20 w-20 text-blue-500" />
            <Eye className="h-10 w-10 text-purple-400 absolute -bottom-2 -right-2" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">GateGuard AI</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Advanced AI-powered security and access management system for high-traffic venues.
            Real-time monitoring, anomaly detection, and intelligent access control.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="gradient-button mt-8 px-8 py-3 rounded-lg font-medium"
          >
            Start Monitoring
          </button>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="bento-card p-6">
            <Eye className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-400">
              Live video feeds with AI-powered object detection and tracking for comprehensive venue security.
            </p>
          </div>

          <div className="bento-card p-6">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Anomaly Detection</h3>
            <p className="text-gray-400">
              Intelligent algorithms detect unusual behavior, crowd movements, and security threats in real-time.
            </p>
          </div>

          <div className="bento-card p-6">
            <Users className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Control</h3>
            <p className="text-gray-400">
              Monitor and manage entry points with AI-powered tracking of people entering and exiting venues.
            </p>
          </div>

          <div className="bento-card p-6">
            <BarChart3 className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-gray-400">
              Comprehensive analytics including heatmaps, demographics, and detailed security event logs.
            </p>
          </div>
        </div>

        <div className="glass-panel overflow-hidden shadow-glow-blue">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect Cameras</h3>
                <p className="text-gray-400">
                  Integrate with your existing security camera infrastructure through the Nx HTTP Server API.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
                <p className="text-gray-400">
                  Our advanced AI models analyze video feeds to detect objects, track movement, and identify anomalies.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Alerts</h3>
                <p className="text-gray-400">
                  Receive instant notifications when security events are detected, with detailed reports and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;