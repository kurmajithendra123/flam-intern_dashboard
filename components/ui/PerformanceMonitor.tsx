'use client';

import React from 'react';
import { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics?: PerformanceMetrics;
}

export default function PerformanceMonitor({ metrics }: PerformanceMonitorProps) {
  // Handle undefined metrics gracefully
  const fps = metrics?.fps ?? 0;
  
  const getFPSClass = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20 shadow-xl">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Performance
      </h3>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 uppercase tracking-wide">FPS</span>
          <span className={`text-2xl font-bold mt-1 ${getFPSClass(fps)}`}>
            {fps || '--'}
          </span>
        </div>
      </div>
    </div>
  );
}
