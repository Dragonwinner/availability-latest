export interface DomainResult {
  id: string; // Add unique identifier
  domain: string;
  status: 'available' | 'registered' | 'error';
  error?: string;
  timestamp: number;
}

export interface ProcessingStats {
  total: number;
  processed: number;
  available: number;
  registered: number;
  errors: number;
}

export interface Settings {
  batchSize: number;
  concurrentBatches: number;
  timeout: number;
}