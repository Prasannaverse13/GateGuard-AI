import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from '../types';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertIntervalRef = useRef<number | null>(null);

  // Initialize with mock alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: 'alert1',
        title: 'Unusual Crowd Movement',
        description: 'Sudden crowd dispersal detected at Main Entrance',
        type: 'anomaly',
        severity: 'high',
        cameraId: 'cam1',
        cameraName: 'Main Entrance',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        acknowledged: false
      },
      {
        id: 'alert2',
        title: 'Restricted Area Access',
        description: 'Unauthorized person detected in restricted zone',
        type: 'intrusion',
        severity: 'high',
        cameraId: 'cam3',
        cameraName: 'Restricted Zone',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        acknowledged: true
      },
      {
        id: 'alert3',
        title: 'High Crowd Density',
        description: 'Crowd density exceeding 75% at Ticket Counter',
        type: 'crowd',
        severity: 'medium',
        cameraId: 'cam5',
        cameraName: 'Ticket Counter',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        acknowledged: false
      },
      {
        id: 'alert4',
        title: 'Camera Offline',
        description: 'East Wing camera disconnected',
        type: 'system',
        severity: 'medium',
        cameraId: 'cam4',
        cameraName: 'East Wing',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        acknowledged: true
      },
      {
        id: 'alert5',
        title: 'Suspicious Behavior',
        description: 'Person loitering at North Gate for extended period',
        type: 'anomaly',
        severity: 'low',
        cameraId: 'cam2',
        cameraName: 'North Gate',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        acknowledged: false
      },
      {
        id: 'alert6',
        title: 'System Update Required',
        description: 'Security system update available',
        type: 'system',
        severity: 'low',
        cameraId: '',
        cameraName: 'System',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        acknowledged: false
      }
    ];
    
    setAlerts(mockAlerts);
  }, []);

  // Generate new alerts periodically
  useEffect(() => {
    const generateRandomAlert = () => {
      const cameraIds = ['cam1', 'cam2', 'cam3', 'cam5'];
      const cameraNames = ['Main Entrance', 'North Gate', 'Restricted Zone', 'Ticket Counter'];
      const types = ['anomaly', 'intrusion', 'crowd', 'system'];
      const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      
      const randomCameraIndex = Math.floor(Math.random() * cameraIds.length);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      let title = '';
      let description = '';
      
      if (randomType === 'anomaly') {
        title = 'Unusual Behavior Detected';
        description = `Suspicious activity detected at ${cameraNames[randomCameraIndex]}`;
      } else if (randomType === 'intrusion') {
        title = 'Possible Intrusion';
        description = `Unauthorized access at ${cameraNames[randomCameraIndex]}`;
      } else if (randomType === 'crowd') {
        title = 'Crowd Density Alert';
        description = `High crowd density at ${cameraNames[randomCameraIndex]}`;
      } else {
        title = 'System Notification';
        description = 'System performance degradation detected';
      }
      
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        title,
        description,
        type: randomType,
        severity: randomSeverity,
        cameraId: cameraIds[randomCameraIndex],
        cameraName: cameraNames[randomCameraIndex],
        timestamp: new Date().toISOString(),
        acknowledged: false
      };
      
      return newAlert;
    };
    
    // Using window.setTimeout instead of setInterval for better browser compatibility
    const scheduleNextAlert = () => {
      const timeoutId = window.setTimeout(() => {
        if (Math.random() > 0.5) { // 50% chance to generate an alert
          const newAlert = generateRandomAlert();
          addAlert(newAlert);
        }
        scheduleNextAlert(); // Schedule the next alert
      }, 45000);
      
      alertIntervalRef.current = timeoutId as unknown as number;
    };
    
    scheduleNextAlert();
    
    // Cleanup function
    return () => {
      if (alertIntervalRef.current !== null) {
        window.clearTimeout(alertIntervalRef.current);
      }
    };
  }, []);

  const addAlert = (alert: Alert) => {
    setAlerts(prevAlerts => [alert, ...prevAlerts]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, acknowledgeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};