'use client';

import React from 'react';
import { ChartType } from '@/lib/types';

interface FilterPanelProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export default function FilterPanel({ chartType, onChartTypeChange }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 uppercase tracking-wide">Chart Type</label>
      <select
        value={chartType}
        onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
        className="bg-gray-700 text-white border border-gray-600 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="all">All Charts</option>
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="scatter">Scatter Plot</option>
        <option value="heatmap">Heatmap</option>
      </select>
    </div>
  );
}
