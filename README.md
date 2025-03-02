# GateGuard AI - Security Monitoring System

GateGuard AI is an advanced security monitoring system that uses AI to enhance venue security and access management. The system provides real-time monitoring, anomaly detection, and demographic analysis to help security personnel maintain safety and optimize operations.

![GateGuard AI Dashboard](https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80)

## Features

- **Real-time Video Monitoring**: View multiple camera feeds simultaneously with grid and single-camera views
- **AI-Powered Detection**: Identify people, faces, and anomalies in real-time
- **Special Event Detection**: Detect smoke, fire, and unusual crowd movements (crowd dispersal)
- **Demographic Analysis**: Analyze audience demographics including age, gender, and nationality
- **Alert Management**: Track and respond to security events with a comprehensive alert system
- **Analytics Dashboard**: Visualize security data with heatmaps and charts
- **Customizable Settings**: Adjust AI sensitivity and detection parameters

## Technology Stack

- React with TypeScript
- TensorFlow.js for AI processing
- Supabase for backend storage
- Tailwind CSS for styling
- Lucide React for icons

## Nx HTTP Server API Integration

The Nx HTTP Server API integration is implemented in the following files:

### 1. Camera Context (`src/context/CameraContext.tsx`)

This file contains the core integration with the Nx HTTP Server API. The system connects to camera feeds through the Nx HTTP Server API using the following code:

```typescript
// In src/context/CameraContext.tsx
const fetchCamerasFromNxServer = async () => {
  try {
    const response = await fetch(`${serverSettings.nxServerUrl}/api/cameras`, {
      headers: {
        'Authorization': `Bearer ${serverSettings.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cameras from Nx Server');
    }
    
    const camerasData = await response.json();
    return camerasData.map(camera => ({
      id: camera.id,
      name: camera.name,
      location: camera.location,
      streamUrl: `${serverSettings.nxServerUrl}/api/cameras/${camera.id}/media`,
      thumbnailUrl: camera.thumbnailUrl || defaultThumbnail,
      status: camera.status
    }));
  } catch (error) {
    console.error('Error fetching cameras from Nx Server:', error);
    return [];
  }
};
```

### 2. Settings Page (`src/pages/Settings.tsx`)

The Settings page allows users to configure the Nx HTTP Server connection:

```typescript
// In src/pages/Settings.tsx - Server Configuration Section
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
```

### 3. Camera Grid Component (`src/components/CameraGrid.tsx`)

The CameraGrid component displays video feeds from the Nx HTTP Server:

```typescript
// In src/components/CameraGrid.tsx
// Video element for Nx Server camera feeds
<video 
  ref={el => videoRefs.current[camera.id] = el}
  className="w-full h-48 object-contain bg-black"
  muted={isMuted}
  loop
  autoPlay
  playsInline
/>
```

## Nx Meta Platform Integration

The Nx Meta Platform integration is implemented in the AI processing components:

### 1. AI Context (`src/context/AIContext.tsx`)

This file contains the integration with the Nx Meta Platform for AI processing:

```typescript
// In src/context/AIContext.tsx
// Integration with Nx Meta Platform for AI processing
const processFrameWithNxMeta = async (videoElement, canvas) => {
  if (!videoElement || !canvas) return;
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the current video frame to the canvas
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, ```typescript
    // Draw the current video frame to the canvas
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Send to Nx Meta Platform for processing
    const response = await fetch(`${serverSettings.nxMetaUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serverSettings.apiKey}`
      },
      body: JSON.stringify({
        imageData: Array.from(imageData.data),
        width: canvas.width,
        height: canvas.height,
        sensitivity: sensitivity,
        detectionTypes: detectionTypes
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to process frame with Nx Meta Platform');
    }
    
    const detectionResults = await response.json();
    return detectionResults;
  } catch (error) {
    console.error('Error processing frame with Nx Meta Platform:', error);
    return null;
  }
};
```

### 2. Face Detection Processor (`src/components/FaceDetectionProcessor.tsx`)

This component handles face detection using the Nx Meta Platform:

```typescript
// In src/components/FaceDetectionProcessor.tsx
// Process video frames with Nx Meta Platform
const processFrameWithNxMeta = async () => {
  if (!videoRef.current || !canvasRef.current) return;
  
  try {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Send frame to Nx Meta Platform for processing
    const detections = await aiContext.processFrameWithNxMeta(video, canvas);
    
    if (detections && detections.length > 0) {
      // Process and display detections
      detections.forEach(detection => {
        addDetection({
          id: `detection-${Date.now()}-${Math.random()}`,
          cameraId: cameraId,
          type: detection.type,
          label: detection.label,
          confidence: detection.confidence,
          boundingBox: detection.boundingBox,
          isAnomaly: detection.isAnomaly,
          timestamp: new Date().toISOString(),
          landmarks: detection.landmarks
        });
      });
    }
  } catch (error) {
    console.error('Error processing frame with Nx Meta Platform:', error);
  }
};
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gateguard-ai.git
   cd gateguard-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Connecting to Nx HTTP Server

To connect GateGuard AI to your Nx HTTP Server:

1. Go to the Settings page
2. In the Server Configuration section, enter:
   - Nx HTTP Server URL (e.g., `http://your-nx-server-ip:7001`)
   - API Key for authentication
3. Click "Save Changes"

The system will automatically attempt to connect to your Nx HTTP Server and retrieve camera feeds.

### Connecting to Nx Meta Platform

To enable AI processing with the Nx Meta Platform:

1. Go to the Settings page
2. In the Server Configuration section, enter:
   - Nx Meta Platform URL (e.g., `http://your-nx-meta-ip:8080`)
   - API Key for authentication
3. In the AI Settings section, select the detection types you want to enable
4. Click "Save Changes"

## Development

### Project Structure

- `/src`: Source code
  - `/components`: React components
  - `/context`: React context providers
  - `/lib`: Utility functions and libraries
  - `/pages`: Page components
  - `/types`: TypeScript type definitions

### Key Files

- `src/context/CameraContext.tsx`: Camera management and Nx HTTP Server integration
- `src/context/AIContext.tsx`: AI processing and Nx Meta Platform integration
- `src/components/FaceDetectionProcessor.tsx`: Face detection implementation
- `src/components/DetectionOverlay.tsx`: Visualization of AI detections
- `src/pages/LiveMonitoring.tsx`: Main monitoring interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js for AI capabilities
- Supabase for backend services
- Nx HTTP Server and Nx Meta Platform for camera integration and AI processing
