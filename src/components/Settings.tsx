import React from 'react';
import { Settings } from '../types';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <SettingsIcon className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Batch Size
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={settings.batchSize}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                batchSize: parseInt(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Concurrent Batches
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.concurrentBatches}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                concurrentBatches: parseInt(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timeout (ms)
          </label>
          <input
            type="number"
            min="1000"
            max="10000"
            step="1000"
            value={settings.timeout}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                timeout: parseInt(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};