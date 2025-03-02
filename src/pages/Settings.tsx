import React, { useState } from 'react';
import { Settings as SettingsIcon, Camera, Bell, Shield, Server, Save } from 'lucide-react';
import { useCameraContext } from '../context/CameraContext';
import { useAIContext } from '../context/AIContext';

const Settings: React.FC = () => {
  const { cameras, addCamera, removeCamera } = useCameraContext();
  const { sensitivity, setSensitivity, detectionThreshold, setDetectionThreshold } = useAIContext();
  
  const [activeTab, setActiveTab] = useState('cameras');
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    url: '',
    apiKey: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    emailAddress: 'admin@example.com',
    alertThreshold: 'medium'
  });
  const [serverSettings, setServerSettings] = useState({
    nxServerUrl: 'http://nx-server-ip',
    aiServerUrl: 'http://localhost:5000',
    apiKey: '********-****-****-****-************'
  });
  const [detectionTypes, setDetectionTypes] = useState({
    peopleDetection: true,
    crowdDensity: true,
    anomalyDetection: true,
    faceRecognition: false
  });

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCamera.name && newCamera.url) {
      addCamera({
        id: Date.now().toString(),
        name: newCamera.name,
        location: newCamera.location,
        streamUrl: newCamera.url,
        thumbnailUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
        status: 'online'
      });
      setNewCamera({
        name: '',
        location: '',
        url: '',
        apiKey: ''
      });
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleServerSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerSettings({
      ...serverSettings,
      [name]: value
    });
  };

  const handleDetectionTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDetectionTypes({
      ...detectionTypes,
      [name]: checked
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-400">Configure system preferences</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              className={`px-4 py-3 font-medium flex items-center ${
                activeTab === 'cameras' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('cameras')}
            >
              <Camera className="h-5 w-5 mr-2" />
              Cameras
            </button>
            <button
              className={`px-4 py-3 font-medium flex items-center ${
                activeTab === 'ai' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              <Shield className="h-5 w-5 mr-2" />
              AI Settings
            </button>
            <button
              className={`px-4 py-3 font-medium flex items-center ${
                activeTab === 'notifications' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              className={`px-4 py-3 font-medium flex items-center ${
                activeTab === 'server' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('server')}
            >
              <Server className="h-5 w-5 mr-2" />
              Server
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'cameras' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Camera Management</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Connected Cameras</h3>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {cameras.map((camera) => (
                        <tr key={camera.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-md object-cover" src={camera.thumbnailUrl} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">{camera.name}</div>
                                <div className="text-sm text-gray-400">ID: {camera.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{camera.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              camera.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {camera.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <button className="text-blue-500 hover:text-blue-400 mr-3">Edit</button>
                            <button 
                              className="text-red-500 hover:text-red-400"
                              onClick={() => removeCamera(camera.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Add New Camera</h3>
                <form onSubmit={handleAddCamera} className="bg-gray-900 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="camera-name" className="block text-sm font-medium text-gray-400 mb-1">
                        Camera Name
                      </label>
                      <input
                        type="text"
                        id="camera-name"
                        value={newCamera.name}
                        onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Main Entrance Camera"
                      />
                    </div>
                    <div>
                      <label htmlFor="camera-location" className="block text-sm font-medium text-gray-400 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="camera-location"
                        value={newCamera.location}
                        onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Main Entrance"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="camera-url" className="block text-sm font-medium text-gray-400 mb-1">
                        Stream URL
                      </label>
                      <input
                        type="text"
                        id="camera-url"
                        value={newCamera.url}
                        onChange={(e) => setNewCamera({...newCamera, url: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="http://nx-server-ip/api/cameras/1/media"
                      />
                    </div>
                    <div>
                      <label htmlFor="camera-api-key" className="block text-sm font-medium text-gray-400 mb-1">
                        API Key (Optional)
                      </label>
                      <input
                        type="password"
                        id="camera-api-key"
                        value={newCamera.apiKey}
                        onChange={(e) => setNewCamera({...newCamera, apiKey: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter API key if required"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium flex items-center"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Camera
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">AI Configuration</h2>
              
              <div className="bg-gray-900 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Detection Settings</h3>
                
                <div className="mb-4">
                  <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-400 mb-1">
                    AI Sensitivity: {sensitivity}%
                  </label>
                  <input
                    type="range"
                    id="sensitivity"
                    min="0"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
                    Detection Threshold: {detectionThreshold}%
                  </label>
                  <input
                    type="range"
                    id="threshold"
                    min="0"
                    max="100"
                    value={detectionThreshold}
                    onChange={(e) => setDetectionThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Detections</span>
                    <span>Balanced</span>
                    <span>Higher Accuracy</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Detection Types</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="peopleDetection"
                      checked={detectionTypes.peopleDetection}
                      onChange={handleDetectionTypeChange}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="ml-2">People Detection</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="crowdDensity"
                      checked={detectionTypes.crowdDensity}
                      onChange={handleDetectionTypeChange}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="ml-2">Crowd Density Analysis</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="anomalyDetection"
                      checked={detectionTypes.anomalyDetection}
                      onChange={handleDetectionTypeChange}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="ml-2">Anomaly Detection</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="faceRecognition"
                      checked={detectionTypes.faceRecognition}
                      onChange={handleDetectionTypeChange}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="ml-2">Face Recognition</span>
                    <span className="ml-2 text-xs text-gray-500">(Premium Feature)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Alert Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                      />
                      <span className="ml-2">Email Notifications</span>
                    </label>
                    
                    {notificationSettings.emailNotifications && (
                      <div className="mt-2 ml-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="emailAddress"
                          value={notificationSettings.emailAddress}
                          onChange={handleNotificationChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                      />
                      <span className="ml-2">Push Notifications</span>
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-400 mb-1">
                      Alert Threshold
                    </label>
                    <select
                      id="alertThreshold"
                      name="alertThreshold"
                      value={notificationSettings.alertThreshold}
                      onChange={(e) => setNotificationSettings({...notificationSettings, alertThreshold: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">High Priority Only</option>
                      <option value="medium">Medium Priority and Above</option>
                      <option value="all">All Alerts</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'server' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Server Configuration</h2>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">API Endpoints</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nx-server" className="block text-sm font-medium text-gray-400 mb-1">
                      Nx HTTP Server URL
                    </label>
                    <input
                      type="text"
                      id="nx-server"
                      name="nxServerUrl"
                      value={serverSettings.nxServerUrl}
                      onChange={handleServerSettingsChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ai-server" className="block text-sm font-medium text-gray-400 mb-1">
                      AI Processing Server URL
                    </label>
                    <input
                      type="text"
                      id="ai-server"
                      name="aiServerUrl"
                      value={serverSettings.aiServerUrl}
                      onChange={handleServerSettingsChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-400 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      id="api-key"
                      name="apiKey"
                      value={serverSettings.apiKey}
                      onChange={handleServerSettingsChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-gray-900 border-t border-gray-700 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;