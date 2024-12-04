import React, { useState } from 'react';
import { Download, ArrowUpDown } from 'lucide-react';
import { DomainResult } from '../types';

interface ResultsTableProps {
  results: DomainResult[];
  onExport: (type: 'csv' | 'available' | 'registered') => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onExport }) => {
  const [sortField, setSortField] = useState<keyof DomainResult>('domain');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'available' | 'registered'>('all');

  const sortedResults = [...results].sort((a, b) => {
    const compareValue = String(a[sortField]).localeCompare(String(b[sortField]));
    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  const filteredResults = sortedResults.filter((result) => {
    if (filter === 'all') return true;
    return result.status === filter;
  });

  const handleSort = (field: keyof DomainResult) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'available' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter('registered')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'registered' ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            Registered
          </button>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onExport('available')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Available
          </button>
          <button
            onClick={() => onExport('registered')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Registered
          </button>
          <button
            onClick={() => onExport('csv')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('domain')}
              >
                <div className="flex items-center">
                  Domain
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResults.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">{result.domain}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'registered'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.error || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};