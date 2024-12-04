import React from 'react';
import { ProcessingStats } from '../types';

interface ProgressBarProps {
  stats: ProcessingStats;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  const percentage = (stats.processed / stats.total) * 100;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Progress: {stats.processed} / {stats.total}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 p-2 rounded-lg">
          <div className="text-green-800 font-semibold">{stats.available}</div>
          <div className="text-sm text-green-600">Available</div>
        </div>
        <div className="bg-red-100 p-2 rounded-lg">
          <div className="text-red-800 font-semibold">{stats.registered}</div>
          <div className="text-sm text-red-600">Registered</div>
        </div>
        <div className="bg-yellow-100 p-2 rounded-lg">
          <div className="text-yellow-800 font-semibold">{stats.errors}</div>
          <div className="text-sm text-yellow-600">Errors</div>
        </div>
      </div>
    </div>
  );
};