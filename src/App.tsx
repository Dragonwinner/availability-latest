import React, { useState, useCallback, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { DomainInput } from './components/DomainInput';
import { ResultsTable } from './components/ResultsTable';
import { ProgressBar } from './components/ProgressBar';
import { SettingsPanel } from './components/Settings';
import { Statistics } from './components/Statistics';
import { DomainValueAnalysis } from './components/DomainValueAnalysis';
import { DomainResult, ProcessingStats, Settings } from './types';
import { validateDomain, processDomainBatch } from './utils/domainUtils';
import { exportToCsv, exportDomainList } from './utils/exportUtils';
import { Globe } from 'lucide-react';

function App() {
  const [domains, setDomains] = useState<string[]>([]);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    processed: 0,
    available: 0,
    registered: 0,
    errors: 0,
  });
  const [settings, setSettings] = useState<Settings>({
    batchSize: 25, // Reduced batch size for better reliability
    concurrentBatches: 1, // Single batch processing for better accuracy
    timeout: 15000, // Increased timeout for more reliable results
  });

  const abortController = useRef<AbortController | null>(null);

  const handleDomainsLoaded = useCallback((newDomains: string[]) => {
    const validDomains = [...new Set(newDomains.filter(validateDomain))]; // Remove duplicates
    setDomains(validDomains);
    setResults([]);
    setStats({
      total: validDomains.length,
      processed: 0,
      available: 0,
      registered: 0,
      errors: 0,
    });
  }, []);

  const processDomains = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    abortController.current = new AbortController();
    
    // Clear previous results when starting new processing
    setResults([]);
    setStats(prev => ({
      ...prev,
      processed: 0,
      available: 0,
      registered: 0,
      errors: 0,
    }));
    
    const batchCount = Math.ceil(domains.length / settings.batchSize);
    const batches: string[][] = Array.from({ length: batchCount }, (_, i) =>
      domains.slice(i * settings.batchSize, (i + 1) * settings.batchSize)
    );

    try {
      for (let i = 0; i < batchCount; i += settings.concurrentBatches) {
        if (abortController.current?.signal.aborted) break;

        const currentBatches = batches.slice(i, i + settings.concurrentBatches);
        const batchResults = await Promise.all(
          currentBatches.map((batch) => processDomainBatch(batch, settings.timeout))
        );

        const newResults: DomainResult[] = [];
        batchResults.forEach((batchResult) => {
          batchResult.forEach((isAvailable, domain) => {
            const result: DomainResult = {
              id: `${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              domain,
              status: isAvailable ? 'available' : 'registered',
              timestamp: Date.now(),
            };
            newResults.push(result);
          });
        });

        setResults(prev => [...prev, ...newResults]);
        setStats(prev => ({
          ...prev,
          processed: prev.processed + newResults.length,
          available: prev.available + newResults.filter((r) => r.status === 'available').length,
          registered: prev.registered + newResults.filter((r) => r.status === 'registered').length,
        }));

        // Add delay between batches to avoid rate limiting
        if (i + settings.concurrentBatches < batchCount) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('Error processing domains:', error);
    } finally {
      setIsProcessing(false);
      abortController.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bulk Domain Checker
          </h1>
          <p className="text-gray-600">
            Check availability and identify high-value domains
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <FileUpload onDomainsLoaded={handleDomainsLoaded} />
            <div className="text-center text-gray-600">or</div>
            <DomainInput onDomainsSubmit={handleDomainsLoaded} />
          </div>

          <div className="flex justify-center">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>

          {domains.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={isProcessing ? () => abortController.current?.abort() : processDomains}
                className={`px-6 py-3 rounded-lg text-white font-semibold ${
                  isProcessing
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isProcessing ? 'Stop Processing' : 'Start Processing'}
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="flex justify-center">
              <ProgressBar stats={stats} />
            </div>
          )}

          {!isProcessing && stats.processed > 0 && (
            <>
              <div className="flex justify-center">
                <Statistics stats={stats} />
              </div>
              <div className="flex justify-center">
                <DomainValueAnalysis results={results} />
              </div>
            </>
          )}

          {results.length > 0 && (
            <div className="flex justify-center">
              <ResultsTable 
                results={results} 
                onExport={(type) => type === 'csv' ? exportToCsv(results) : exportDomainList(results, type)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;