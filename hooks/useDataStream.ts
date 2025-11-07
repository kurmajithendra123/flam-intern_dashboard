'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { generateDataPoints } from '@/lib/dataGenerator';

export function useDataStream(initialData: DataPoint[] = []) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [isRunning, setIsRunning] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(100);
  const [pointsPerUpdate, setPointsPerUpdate] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxPoints = 10000;

  const addData = useCallback((points: DataPoint[]) => {
    setData(prevData => {
      const newData = [...prevData, ...points];
      return newData.length > maxPoints ? newData.slice(-maxPoints) : newData;
    });
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    console.log('Starting data stream...');
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      const newPoints = generateDataPoints(pointsPerUpdate);
      addData(newPoints);
    }, updateInterval);
  }, [isRunning, updateInterval, pointsPerUpdate, addData]);

  const pause = useCallback(() => {
    console.log('Pausing data stream...');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    console.log('Clearing data...');
    setData([]);
  }, []);

  const stressTest = useCallback(() => {
    console.log('Running stress test...');
    const points = generateDataPoints(5000);
    addData(points);
  }, [addData]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      pause();
      setTimeout(() => start(), 100);
    }
  }, [updateInterval, pointsPerUpdate]);

  return {
    data,
    isRunning,
    start,
    pause,
    clear,
    stressTest,
    setUpdateInterval,
    setPointsPerUpdate,
    updateInterval,
    pointsPerUpdate
  };
}
