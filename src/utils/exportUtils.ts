import { DomainResult } from '../types';

export const exportToCsv = (results: DomainResult[]): void => {
  const csv = [
    ['Domain', 'Status', 'Timestamp'].join(','),
    ...results.map((r) => [r.domain, r.status, new Date(r.timestamp).toISOString()].join(',')),
  ].join('\n');

  downloadFile(csv, 'domain-check-results.csv', 'text/csv');
};

export const exportDomainList = (results: DomainResult[], type: 'available' | 'registered'): void => {
  const domains = results
    .filter(result => result.status === type)
    .map(result => result.domain)
    .join('\n');

  downloadFile(domains, `${type}-domains.txt`, 'text/plain');
};

const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};