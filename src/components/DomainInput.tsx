import React, { useState } from 'react';

interface DomainInputProps {
  onDomainsSubmit: (domains: string[]) => void;
}

export const DomainInput: React.FC<DomainInputProps> = ({ onDomainsSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domains = input
      .split('\n')
      .map((domain) => domain.trim())
      .filter(Boolean);
    if (domains.length > 0) {
      onDomainsSubmit(domains);
      // Don't clear input to allow for modifications
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <textarea
        className="w-full h-48 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter domains (one per line)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Load Domains
      </button>
    </form>
  );
};