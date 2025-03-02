import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Detection } from '../types';
import { useCameraContext } from './CameraContext';

interface AIContextType {
  detections: Detection[];
  addDetection: (detection: Detection) => void;
  processingEnabled: boolean;
  toggleProcessing: () => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
  detectionThreshold: number;
  setDetectionThreshold: (value: number) => void;
  demographicData: DemographicData;
}

export interface DemographicData {
  gender: {
    male: number;
    female: number;
    other: number;
  };
  age: {
    under18: number;
    age18to24: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55plus: number;
  };
  nationality: {
    domestic: number;
    international: number;
  };
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [processingEnabled, setProcessingEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(75);
  const [detectionThreshold, setDetectionThreshold] = useState(60);
  const detectionTimerRef = useRef<number | null>(null);
  const { cameras } = useCameraContext();
  
  // Demographic data state
  const [demographicData, setDemographicData] = useState<DemographicData>({
    gender: {
      male: 58,
      female: 40,
      other: 2
    },
    age: {
      under18: 12,
      age18to24: 25,
      age25to34: 30,
      age35to44: 18,
      age45to54: 10,
      age55plus: 5
    },
    nationality: {
      domestic: 75,
      international: 25
    }
  });
  
  const toggleProcessing = () => {
    setProcessingEnabled(prev => !prev);
  };

  // Add a new detection
  const addDetection = (detection: Detection) => {
    // Check if this is the Hall Crowd camera - don't add detections for it
    const camera = cameras.find(cam => cam.id === detection.cameraId);
    if (camera?.name.toLowerCase().includes('hall crowd')) {
      return;
    }
    
    setDetections(prev => {
      // Keep only the most recent 50 detections to prevent memory issues
      const newDetections = [detection, ...prev];
      if (newDetections.length > 50) {
        return newDetections.slice(0, 50);
      }
      return newDetections;
    });
    
    // Update demographic data when a face is detected
    if (detection.type === 'face' && Math.random() > 0.7) {
      updateDemographicData();
    }
  };

  // Update demographic data with slight random variations
  const updateDemographicData = () => {
    setDemographicData(prev => {
      // Create small random variations in the data
      const malePercentage = prev.gender.male + (Math.random() * 4 - 2);
      const femalePercentage = prev.gender.female + (Math.random() * 4 - 2);
      
      // Normalize to ensure percentages add up to 100
      const total = malePercentage + femalePercentage;
      const normalizedMale = Math.round((malePercentage / total) * 98);
      const normalizedFemale = Math.round((femalePercentage / total) * 98);
      
      return {
        gender: {
          male: normalizedMale,
          female: normalizedFemale,
          other: 100 - normalizedMale - normalizedFemale
        },
        age: {
          under18: Math.max(5, Math.min(20, prev.age.under18 + (Math.random() * 4 - 2))),
          age18to24: Math.max(15, Math.min(35, prev.age.age18to24 + (Math.random() * 4 - 2))),
          age25to34: Math.max(20, Math.min(40, prev.age.age25to34 + (Math.random() * 4 - 2))),
          age35to44: Math.max(10, Math.min(30, prev.age.age35to44 + (Math.random() * 4 - 2))),
          age45to54: Math.max(5, Math.min(20, prev.age.age45to54 + (Math.random() * 4 - 2))),
          age55plus: Math.max(2, Math.min(15, prev.age.age55plus + (Math.random() * 4 - 2)))
        },
        nationality: {
          domestic: Math.max(60, Math.min(90, prev.nationality.domestic + (Math.random() * 6 - 3))),
          international: Math.max(10, Math.min(40, prev.nationality.international + (Math.random() * 6 - 3)))
        }
      };
    });
  };

  // Clear old detections periodically
  useEffect(() => {
    const clearOldDetections = () => {
      const now = Date.now();
      setDetections(prev => 
        prev.filter(detection => {
          const detectionTime = new Date(detection.timestamp).getTime();
          // Keep detections that are less than 10 seconds old
          return now - detectionTime < 10000;
        })
      );
    };
    
    const intervalId = setInterval(clearOldDetections, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Simulate AI detections for non-face objects
  useEffect(() => {
    if (!processingEnabled) {
      return;
    }

    // Generate initial detections
    const generateDetections = () => {
      // Only generate for Supabase cameras that are not Hall Crowd
      const eligibleCameras = cameras.filter(cam => 
        cam.id.startsWith('supabase-cam') && 
        !cam.name.toLowerCase().includes('hall crowd')
      );
      
      const cameraIds = eligibleCameras.map(cam => cam.id);
      const newDetections: Detection[] = [];
      
      cameraIds.forEach(cameraId => {
        // Number of detections based on sensitivity
        const numPeople = Math.floor(Math.random() * (sensitivity / 30)) + 1;
        
        for (let i = 0; i < numPeople; i++) {
          // Determine if this is a special detection (smoke, fire, crowd dispersal)
          const specialDetectionChance = Math.random();
          let detectionType = 'person';
          let isAnomaly = Math.random() < 0.1; // 10% chance of anomaly for regular detections
          let label = isAnomaly ? 'Suspicious Person' : 'Person';
          
          // 5% chance of smoke detection
          if (specialDetectionChance < 0.05) {
            detectionType = 'smoke';
            isAnomaly = true;
            label = 'Smoke Detected';
          } 
          // 3% chance of fire detection
          else if (specialDetectionChance < 0.08) {
            detectionType = 'fire';
            isAnomaly = true;
            label = 'Fire Detected';
          } 
          // 7% chance of crowd dispersal
          else if (specialDetectionChance < 0.15) {
            detectionType = 'crowd_dispersal';
            isAnomaly = true;
            label = 'Crowd Dispersal';
          }
          
          newDetections.push({
            id: `${cameraId}-${Date.now()}-${i}`,
            cameraId,
            type: detectionType,
            label: label,
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
            boundingBox: {
              x: Math.random() * 0.7, // Normalized coordinates (0-1)
              y: Math.random() * 0.7,
              width: Math.random() *  0.2 + 0.1,
              height: Math.random() * 0.3 + 0.2
            },
            isAnomaly,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Add all new detections
      newDetections.forEach(detection => {
        addDetection(detection);
      });
    };

    // Initial generation
    generateDetections();
    
    // Update detections periodically using setTimeout instead of setInterval
    const scheduleNextDetection = () => {
      detectionTimerRef.current = window.setTimeout(() => {
        generateDetections();
        scheduleNextDetection();
      }, 5000);
    };
    
    scheduleNextDetection();
    
    return () => {
      if (detectionTimerRef.current !== null) {
        window.clearTimeout(detectionTimerRef.current);
      }
    };
  }, [processingEnabled, sensitivity, cameras]);

  return (
    <AIContext.Provider 
      value={{ 
        detections, 
        addDetection,
        processingEnabled, 
        toggleProcessing, 
        sensitivity, 
        setSensitivity,
        detectionThreshold,
        setDetectionThreshold,
        demographicData
      }}
    >
      {children}
    </AIContext.Provider>
  );
};