'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { initializeFirebase } from './index';

export interface CameraStatus {
  status: 'active' | 'inactive' | null;
  timestamp?: number;
  device?: string;
}

export function useCameraStatus() {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({ status: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const { database } = initializeFirebase();
      const statusRef = ref(database, 'camera_status');

      const unsubscribe = onValue(
        statusRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setCameraStatus(snapshot.val());
          } else {
            setCameraStatus({ status: null });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Error reading camera status:', error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error initializing camera status listener:', error);
      setIsLoading(false);
    }
  }, []);

  return { cameraStatus, isLoading };
}
