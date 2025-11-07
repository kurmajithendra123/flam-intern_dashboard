'use client';

import { useState, useEffect } from 'react';
import { PerformanceMetrics } from '@/lib/types';

export function usePerformanceMonitor(dataPointCount: number): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFPS = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return metrics;
}
