import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

// Initialize TensorFlow.js
export const initTensorFlow = async () => {
  try {
    await tf.ready();
    console.log('TensorFlow.js initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing TensorFlow.js:', error);
    return false;
  }
};

// Load the BlazeFace model
let model: blazeface.BlazeFaceModel | null = null;

export const loadFaceDetectionModel = async () => {
  try {
    if (!model) {
      console.log('Loading BlazeFace model...');
      model = await blazeface.load({
        maxFaces: 10, // Detect up to 10 faces
        inputWidth: 128, // Lower for better performance
        inputHeight: 128,
        iouThreshold: 0.3, // Lower threshold to detect more faces
        scoreThreshold: 0.5 // Minimum confidence threshold
      });
      console.log('BlazeFace model loaded successfully');
    }
    return model;
  } catch (error) {
    console.error('Error loading BlazeFace model:', error);
    return null;
  }
};

// Detect faces in an image
export const detectFaces = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<blazeface.NormalizedFace[] | null> => {
  try {
    if (!model) {
      model = await loadFaceDetectionModel();
      if (!model) return null;
    }

    // Make predictions
    const predictions = await model.estimateFaces(imageElement, false);
    console.log('Face detection results:', predictions.length, 'faces found');
    return predictions as blazeface.NormalizedFace[];
  } catch (error) {
    console.error('Error detecting faces:', error);
    return null;
  }
};

// Convert BlazeFace detections to our app's Detection format
export const convertToDetections = (
  faces: blazeface.NormalizedFace[],
  cameraId: string,
  imageWidth: number,
  imageHeight: number
) => {
  return faces.map((face, index) => {
    // BlazeFace returns coordinates in absolute pixels, convert to normalized (0-1)
    const x = face.topLeft[0] / imageWidth;
    const y = face.topLeft[1] / imageHeight;
    const width = (face.bottomRight[0] - face.topLeft[0]) / imageWidth;
    const height = (face.bottomRight[1] - face.topLeft[1]) / imageHeight;
    
    // Calculate confidence score
    const confidence = face.probability[0];
    
    // Determine if this is an anomaly (for demo purposes, random with higher probability for certain faces)
    const isAnomaly = confidence > 0.8 && Math.random() > 0.7;
    
    // Convert landmarks to normalized coordinates
    const normalizedLandmarks = face.landmarks?.map(landmark => [
      (landmark[0] / imageWidth) * 100,
      (landmark[1] / imageHeight) * 100
    ]);
    
    return {
      id: `face-${cameraId}-${Date.now()}-${index}`,
      cameraId,
      type: 'face',
      label: isAnomaly ? 'Suspicious Person' : 'Person',
      confidence,
      boundingBox: {
        x,
        y,
        width,
        height
      },
      isAnomaly,
      timestamp: new Date().toISOString(),
      landmarks: normalizedLandmarks
    };
  });
};

// Draw face detections on canvas (for debugging)
export const drawFaceDetections = (
  ctx: CanvasRenderingContext2D,
  faces: blazeface.NormalizedFace[],
  imageWidth: number,
  imageHeight: number
) => {
  faces.forEach(face => {
    const x = face.topLeft[0];
    const y = face.topLeft[1];
    const width = face.bottomRight[0] - face.topLeft[0];
    const height = face.bottomRight[1] - face.topLeft[1];
    
    // Draw bounding box
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Draw landmarks
    if (face.landmarks) {
      ctx.fillStyle = '#FF0000';
      face.landmarks.forEach(landmark => {
        ctx.beginPath();
        ctx.arc(landmark[0], landmark[1], 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    // Draw label
    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.fillRect(x, y - 20, 80, 20);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(`Face: ${Math.round(face.probability[0] * 100)}%`, x + 5, y - 5);
  });
};