import React from 'react';
import { Shield, AlertTriangle, Eye, Sliders, RefreshCw } from 'lucide-react';

interface AIControlPanelProps {
  processingEnabled: boolean;
  toggleProcessing: () => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

const AIControlPanel: React.FC<AIControlPanelProps> = ({
  processingEnabled,
  toggleProcessing,
  sensitivity,
  setSensitivity
}) => {
  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setSensitivity(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">AI Processing</span>
        </div>
        <div>
          <button
            onClick={toggleProcessing}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              processingEnabled ? 'bg-green-600' : 'bg-gray-700'
            }`}
          >
            {processingEnabled ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      <div>
        <label className="flex items-center justify-between text-sm mb-1">
          <span className="flex items-center">
            <Sliders className="h-4 w-4 mr-1 text-gray-400" />
            Sensitivity
          </span>
          <span>{sensitivity}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={handleSensitivityChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sensitivity}%, #374151 ${sensitivity}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800/50">
        <h4 className="text-sm font-medium mb-2">Detection Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-green-500" />
              People Detection
            </span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
              Anomaly Detection
            </span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1 text-blue-500" />
              Face Recognition
            </span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800/50">
        <button
          onClick={toggleProcessing}
          className={`w-full py-2 rounded-lg transition-all ${
            processingEnabled ? 'bg-red-600 hover:bg-red-700' : 'gradient-button'
          }`}
        >
          {processingEnabled ? 'Pause AI Processing' : 'Start AI Processing'}
        </button>
      </div>
    </div>
  );
};

export default AIControlPanel;