'use client';

import React, { useState, useEffect } from 'react';
import { DataPoint } from '@/lib/types';

interface DataTableProps {
  data?: DataPoint[];
}

export default function DataTable({ data }: DataTableProps) {
  const [mounted, setMounted] = useState(false);
  const displayData = (data || []).slice(-100).reverse();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="overflow-y-auto max-h-[320px] rounded-lg border border-gray-700 p-8 text-center">
        <p className="text-gray-400">No data available. Click "Start Streaming" to begin.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[320px] rounded-lg border border-gray-700">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-800 z-10">
          <tr>
            <th className="p-3 text-left border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
            <th className="p-3 text-left border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase">Value</th>
            <th className="p-3 text-left border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase">Category</th>
            <th className="p-3 text-left border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((point, idx) => (
            <tr key={idx} className="hover:bg-gray-800/50 transition-colors border-b border-gray-700/50">
              <td className="p-3 text-sm text-gray-300 font-medium">
                {mounted ? new Date(point.t || point.timestamp || 0).toLocaleTimeString() : ''}
              </td>
              <td className="p-3 text-sm font-mono text-blue-300 font-semibold">
                {point.value.toFixed(2)}
              </td>
              <td className="p-3 text-sm">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-200 font-medium">
                  {point.category || 'N/A'}
                </span>
              </td>
              <td className="p-3 text-sm">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    point.status === 'error' ? 'bg-red-500' :
                    point.status === 'warn' || point.status === 'warning' ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`} />
                  <span className="text-gray-300 font-medium capitalize">{point.status || 'ok'}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
