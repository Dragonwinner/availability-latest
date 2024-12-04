import React from 'react';
import { DomainResult } from '../types';
import { getHighValueDomains } from '../utils/domainAnalytics';
import { TrendingUp } from 'lucide-react';

interface DomainValueAnalysisProps {
  results: DomainResult[];
}

export const DomainValueAnalysis: React.FC<DomainValueAnalysisProps> = ({ results }) => {
  const highValueDomains = getHighValueDomains(results).slice(0, 10); // Top 10 domains

  if (highValueDomains.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold">High-Value Domain Opportunities</h2>
      </div>

      <div className="space-y-4">
        {highValueDomains.map((domain) => (
          <div
            key={domain.domain}
            className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{domain.domain}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Score: {domain.score}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Value Factors:</span>{' '}
              {domain.factors.join(' • ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};