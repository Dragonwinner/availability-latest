import React from 'react';
import { ProcessingStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsProps {
  stats: ProcessingStats;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  const chartData = [
    { name: 'Available', value: stats.available, color: '#10B981' },
    { name: 'Unavailable', value: stats.registered, color: '#EF4444' },
  ];

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Final Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">{stats.processed}</div>
          <div className="text-sm text-blue-600">Checked</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{stats.available}</div>
          <div className="text-sm text-green-600">Available</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-800">{stats.registered}</div>
          <div className="text-sm text-red-600">Unavailable</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={(entry) => entry.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};