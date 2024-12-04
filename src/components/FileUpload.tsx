import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploadProps {
  onDomainsLoaded: (domains: string[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDomainsLoaded }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/csv') {
      Papa.parse(file, {
        complete: (results) => {
          const domains = results.data.flat().filter(Boolean);
          onDomainsLoaded(domains);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    } else if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const domains = JSON.parse(e.target?.result as string);
          if (Array.isArray(domains)) {
            onDomainsLoaded(domains);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [onDomainsLoaded]);

  return (
    <div className="w-full max-w-md">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-sm">Upload CSV or JSON file</span>
        <input
          type="file"
          className="hidden"
          accept=".csv,.json"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};