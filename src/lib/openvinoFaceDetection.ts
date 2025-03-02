import * as ov from '@openvino/wasm-node';
import { WebGPUPlugin } from '@openvino/webgpu-plugin';

// OpenVINO model URLs
const FACE_DETECTION_MODEL_URL = 'https://storage.openvinotoolkit.org/repositories/open_model_zoo/2022.1/models_bin/1/face-detection-retail-0004/FP16/face-detection-retail-0004.xml';
const FACE_DETECTION_WEIGHTS_URL = 'https://storage.openvinotoolkit.org/repositories/open_model_zoo/2022.1/models_bin/1/face-detection-retail-0004/FP16/face-detection-retail-0004.bin';

// Initialize OpenVINO runtime
let runtime: ov.Runtime | null = null;
let model: ov.CompiledModel | null = null;
let isInitialized = false;
let isInitializing = false;

export const initOpenVINO = async (): Promise<boolean> => {
  if (isInitialized) return true;
  if (isInitializing) {
    // Wait for initialization to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (isInitialized) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
    });
  }

  isInitializing = true;
  
  try {
    console.log('Initializing OpenVINO runtime...');
    
    // Initialize OpenVINO runtime
    await ov.initRuntime();
    
    // Try to use WebGPU for acceleration if available
    try {
      const webgpuPlugin = new WebGPUPlugin();
      runtime = await ov.createRuntime({ plugins: [webgpuPlugin] });
      console.log('OpenVINO runtime initialized with WebGPU acceleration');
    } catch (gpuError) {
      console.warn('WebGPU acceleration not available, falling back to default runtime', gpuError);
      runtime = await ov.createRuntime();
      console.log('OpenVINO runtime initialized with default backend');
    }
    
    isInitialized = true;
    isInitializing = false;
    return true;
  } catch (error) {
    console.error('Failed to initialize OpenVINO runtime:', error);
    isInitializing = false;
    return false;
  }
};

export const loadFaceDetectionModel = async (): Promise<boolean> => {
  if (!isInitialized) {
    const initialized = await initOpenVINO();
    if (!initialized) return false;
  }
  
  if (model) return true;
  
  try {
    console.log('Loading face detection model...');
    
    // Fetch model XML
    const modelResponse = await fetch(FACE_DETECTION_MODEL_URL);
    const modelXML = await modelResponse.text();
    
    // Fetch model weights
    const weightsResponse = await fetch(FACE_DETECTION_WEIGHTS_URL);
    const weightsBuffer = await weightsResponse.arrayBuffer();
    
    // Create model from XML and weights
    if (!runtime) {
      throw new Error('OpenVINO runtime not initialized');
    }
    
    const ovModel = await runtime.createModel(modelXML, new Uint8Array(weightsBuffer));
    model = await runtime.compileModel(ovModel);
    
    console.log('Face detection model loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load face detection model:', error);
    return false;
  }
};

// Preprocess image for the model
const preprocessImage = (imageData: ImageData): Float32Array => {
  const { data, width, height } = imageData;
  const inputTensor = new Float32Array(width * height * 3);
  
  // Convert RGBA to RGB and normalize
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pixelIndex = (i * width + j) * 4;
      const tensorIndex = (i * width + j) * 3;
      
      // Normalize to [0, 1] range
      inputTensor[tensorIndex] = data[pixelIndex] / 255.0;     // R
      inputTensor[tensorIndex + 1] = data[pixelIndex + 1] / 255.0; // G
      inputTensor[tensorIndex + 2] = data[pixelIndex + 2] / 255.0; // B
    }
  }
  
  return inputTensor;
};

// Interface for face detection result
export interface FaceDetection {
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Detect faces in an image
export const detectFaces = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  confidenceThreshold: number = 0.5
): Promise<FaceDetection[]> => {
  if (!model) {
    const loaded = await loadFaceDetectionModel();
    if (!loaded) {
      throw new Error('Failed to load face detection model');
    }
  }
  
  try {
    // Create a canvas to get image data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Set canvas dimensions
    canvas.width = imageElement.width || (imageElement as HTMLVideoElement).videoWidth || 300;
    canvas.height = imageElement.height || (imageElement as HTMLVideoElement).videoHeight || 300;
    
    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Preprocess image
    const inputTensor = preprocessImage(imageData);
    
    // Create input tensor
    const inputData = new ov.Tensor(inputTensor, [1, 3, canvas.height, canvas.width]);
    
    // Run inference
    if (!model) {
      throw new Error('Model not loaded');
    }
    
    const results = await model.infer({ data: inputData });
    const output = results['detection_out'] as ov.Tensor;
    const outputData = output.data as Float32Array;
    
    // Process results
    const detections: FaceDetection[] = [];
    
    // The output format is [batch_id, class_id, confidence, x_min, y_min, x_max, y_max]
    for (let i = 0; i < outputData.length; i += 7) {
      const confidence = outputData[i + 2];
      
      if (confidence > confidenceThreshold) {
        // Convert normalized coordinates to pixel values
        const x_min = outputData[i + 3] * canvas.width;
        const y_min = outputData[i + 4] * canvas.height;
        const x_max = outputData[i + 5] * canvas.width;
        const y_max = outputData[i + 6] * canvas.height;
        
        detections.push({
          confidence,
          x: x_min / canvas.width,
          y: y_min / canvas.height,
          width: (x_max - x_min) / canvas.width,
          height: (y_max - y_min) / canvas.height
        });
      }
    }
    
    return detections;
  } catch (error) {
    console.error('Error detecting faces with OpenVINO:', error);
    return [];
  }
};

// Convert OpenVINO detections to our app's Detection format
export const convertToDetections = (
  faces: FaceDetection[],
  cameraId: string
) => {
  return faces.map((face, index) => {
    // Determine if this is an anomaly (for demo purposes, random with higher probability for certain faces)
    const isAnomaly = face.confidence > 0.8 && Math.random() > 0.7;
    
    // Generate random landmarks for visualization
    const landmarks = [];
    const numLandmarks = 5;
    
    for (let i = 0; i < numLandmarks; i++) {
      const lx = (face.x + Math.random() * face.width) * 100;
      const ly = (face.y + Math.random() * face.height) * 100;
      landmarks.push([lx, ly]);
    }
    
    return {
      id: `face-${cameraId}-${Date.now()}-${index}`,
      cameraId,
      type: 'face',
      label: isAnomaly ? 'Suspicious Person' : 'Person',
      confidence: face.confidence,
      boundingBox: {
        x: face.x,
        y: face.y,
        width: face.width,
        height: face.height
      },
      isAnomaly,
      timestamp: new Date().toISOString(),
      landmarks
    };
  });
};