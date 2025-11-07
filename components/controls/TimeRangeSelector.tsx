'use client';

import React from 'react';
import { TimeAggregation } from '@/lib/types';

interface TimeRangeSelectorProps {
  aggregation: TimeAggregation;
  onAggregationChange: (agg: TimeAggregation) => void;
}

export default function TimeRangeSelector({ aggregation, onAggregationChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 uppercase tracking-wide">Time Aggregation</label>
      <select
        value={aggregation}
        onChange={(e) => onAggregationChange(e.target.value as TimeAggregation)}
        className="bg-gray-700 text-white border border-gray-600 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="raw">Raw Data</option>
        <option value="1min">1 Minute</option>
        <option value="5min">5 Minutes</option>
        <option value="1hr">1 Hour</option>
      </select>
    </div>
  );
}
