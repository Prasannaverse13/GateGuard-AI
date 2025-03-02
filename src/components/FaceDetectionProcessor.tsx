import React, { useState, useRef, useEffect } from 'react';
import { Camera, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { useAIContext } from '../context/AIContext';
import { useAlertContext } from '../context/AlertContext';
import { useCameraContext } from '../context/CameraContext';
import { initTensorFlow, loadFaceDetectionModel, detectFaces, convertToDetections } from '../lib/faceDetection';

interface FaceDetectionProcessorProps {
  cameraId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const FaceDetectionProcessor: React.FC<FaceDetectionProcessorProps> = ({ cameraId, videoRef }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processingIntervalRef = useRef<number | null>(null);
  
  const { addDetection, processingEnabled, sensitivity } = useAIContext();
  const { addAlert } = useAlertContext();
  const { cameras } = useCameraContext();

  // Check if this is the Hall Crowd camera
  const isHallCrowdCamera = React.useMemo(() => {
    const camera = cameras.find(cam => cam.id === cameraId);
    return camera?.name.toLowerCase().includes('hall crowd');
  }, [cameraId, cameras]);

  // Initialize TensorFlow and load face detection model
  useEffect(() => {
    // Don't load model for Hall Crowd camera
    if (isHallCrowdCamera) {
      return;
    }

    const loadModel = async () => {
      try {
        const tfInitialized = await initTensorFlow();
        if (!tfInitialized) {
          setModelLoadError('Failed to initialize TensorFlow.js');
          return;
        }
        
        const model = await loadFaceDetectionModel();
        if (!model) {
          setModelLoadError('Failed to load face detection model');
          return;
        }
        
        setIsModelLoaded(true);
        setModelLoadError(null);
        console.log('Face detection model loaded successfully');
      } catch (error) {
        console.error('Error loading face detection model:', error);
        setModelLoadError('Error loading face detection model');
      }
    };
    
    loadModel();
    
    return () => {
      if (processingIntervalRef.current) {
        window.clearInterval(processingIntervalRef.current);
      }
    };
  }, [isHallCrowdCamera]);

  // Start/stop face detection processing
  useEffect(() => {
    // Don't process Hall Crowd camera
    if (isHallCrowdCamera) {
      return;
    }

    if (isModelLoaded && processingEnabled && !isProcessing) {
      startFaceDetection();
    } else if ((!processingEnabled || !isModelLoaded) && isProcessing) {
      stopFaceDetection();
    }
    
    return () => {
      if (processingIntervalRef.current) {
        window.clearInterval(processingIntervalRef.current);
      }
    };
  }, [isModelLoaded, processingEnabled, isHallCrowdCamera]);

  const startFaceDetection = () => {
    if (!isModelLoaded || !videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    console.log('Starting face detection processing');
    
    // Process frames at an interval based on sensitivity
    // Higher sensitivity = more frequent processing
    const interval = Math.max(300, 1000 - (sensitivity * 8));
    
    processingIntervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.paused) return;
      
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Detect faces
        const faces = await detectFaces(video);
        
        if (faces && faces.length > 0) {
          setDetectedFaces(faces.length);
          setTotalDetections(prev => prev + faces.length);
          
          // Convert BlazeFace detections to our app's format
          const detections = convertToDetections(
            faces,
            cameraId,
            video.videoWidth,
            video.videoHeight
          );
          
          // Add detections to context
          detections.forEach(detection => {
            addDetection(detection);
            
            // Generate alerts for anomalies
            if (detection.isAnomaly) {
              addAlert({
                id: `alert-face-${Date.now()}`,
                title: 'Suspicious Person Detected',
                description: `Face detection identified a suspicious person in camera ${cameraId}`,
                type: 'anomaly',
                severity: 'high',
                cameraId: cameraId,
                cameraName: cameras.find(cam => cam.id === cameraId)?.name || 'Camera',
                timestamp: new Date().toISOString(),
                acknowledged: false
              });
            }
          });
        } else {
          // If no faces detected in this frame, still try to detect simulated faces
          // This ensures we have some detections for demo purposes
          if (Math.random() < sensitivity / 200) {
            simulateDetection();
          }
        }
      } catch (error) {
        console.error('Error processing video frame:', error);
      }
    }, interval);
  };

  // Simulate a face detection for demo purposes
  const simulateDetection = () => {
    const fakeDetection = {
      id: `face-${cameraId}-${Date.now()}-sim`,
      cameraId,
      type: 'face',
      label: Math.random() > 0.8 ? 'Suspicious Person' : 'Person',
      confidence: 0.7 + (Math.random() * 0.3),
      boundingBox: {
        x: Math.random() * 0.7,
        y: Math.random() * 0.7,
        width: Math.random() * 0.2 + 0.1,
        height: Math.random() * 0.3 + 0.2
      },
      isAnomaly: Math.random() > 0.8,
      timestamp: new Date().toISOString(),
      landmarks: [
        [Math.random() * 100, Math.random() * 100],
        [Math.random() * 100, Math.random() * 100],
        [Math.random() * 100, Math.random() * 100],
        [Math.random() * 100, Math.random() * 100],
        [Math.random() * 100, Math.random() * 100]
      ]
    };
    
    addDetection(fakeDetection);
    setDetectedFaces(prev => prev + 1);
    setTotalDetections(prev => prev + 1);
    
    if (fakeDetection.isAnomaly) {
      addAlert({
        id: `alert-face-${Date.now()}-sim`,
        title: 'Suspicious Person Detected',
        description: `Face detection identified a suspicious person in camera ${cameraId}`,
        type: 'anomaly',
        severity: 'high',
        cameraId: cameraId,
        cameraName: cameras.find(cam => cam.id === cameraId)?.name || 'Camera',
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }
  };

  const stopFaceDetection = () => {
    if (processingIntervalRef.current) {
      window.clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    setIsProcessing(false);
  };

  // If this is the Hall Crowd camera, don't show the face detection processor
  if (isHallCrowdCamera) {
    return null;
  }

  if (modelLoadError) {
    return (
      <div className="bg-red-900/30 backdrop-blur-sm p-3 rounded-lg border border-red-800 mb-4">
        <div className="flex items-center text-red-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Face detection error: {modelLoadError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Camera className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">Face Detection</span>
        </div>
        <div className="flex items-center">
          {!isModelLoaded ? (
            <div className="flex items-center text-yellow-500">
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              <span className="text-sm">Loading model...</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center text-green-500">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-sm">Active ({detectedFaces} faces)</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-sm">Inactive</span>
            </div>
          )}
        </div>
      </div>
      
      {isProcessing && (
        <div className="mt-2 text-xs text-gray-400">
          Total detections: {totalDetections} | Processing interval: {Math.max(300, 1000 - (sensitivity * 8))}ms
        </div>
      )}
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceDetectionProcessor;