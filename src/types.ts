// Alert Types
export interface Alert {
  id: string;
  title: string;
  description: string;
  type: string; // 'anomaly', 'intrusion', 'crowd', 'system', etc.
  severity: 'low' | 'medium' | 'high';
  cameraId: string;
  cameraName: string;
  timestamp: string;
  acknowledged: boolean;
}

// AI Detection Types
export interface Detection {
  id: string;
  cameraId: string;
  type: string; // 'person', 'vehicle', 'object', 'face', 'smoke', 'fire', 'crowd_dispersal', etc.
  label: string;
  confidence: number;
  boundingBox: {
    x: number; // Normalized coordinates (0-1)
    y: number;
    width: number;
    height: number;
  };
  isAnomaly: boolean;
  timestamp: string;
  landmarks?: number[][]; // Optional face landmarks
}

// Camera Types
export interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  thumbnailUrl: string;
  status: 'online' | 'offline';
}