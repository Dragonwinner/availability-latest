import { DomainResult } from '../types';

interface DomainScore {
  domain: string;
  score: number;
  factors: string[];
}

export const analyzeDomainValue = (domain: string): DomainScore => {
  const factors: string[] = [];
  let score = 0;

  // Length analysis (shorter domains are generally more valuable)
  const domainName = domain.split('.')[0];
  if (domainName.length <= 4) {
    score += 25;
    factors.push('Short domain length');
  } else if (domainName.length <= 8) {
    score += 15;
    factors.push('Medium domain length');
  }

  // Check if it's all letters (no numbers or hyphens)
  if (/^[a-zA-Z]+$/.test(domainName)) {
    score += 20;
    factors.push('All letters');
  }

  // Check for dictionary words
  const commonWords = ['app', 'tech', 'ai', 'web', 'cloud', 'crypto', 'meta', 'data', 'dev'];
  for (const word of commonWords) {
    if (domainName.toLowerCase().includes(word)) {
      score += 15;
      factors.push(`Contains trending term: ${word}`);
    }
  }

  // TLD analysis
  const tld = domain.split('.').pop()?.toLowerCase();
  const premiumTlds = ['com', 'ai', 'io', 'app'];
  if (tld && premiumTlds.includes(tld)) {
    score += 20;
    factors.push('Premium TLD');
  }

  // Memorability factors
  if (domainName.length <= 12 && !domainName.includes('-')) {
    score += 10;
    factors.push('Memorable length');
  }

  return {
    domain,
    score: Math.min(100, score), // Cap at 100
    factors
  };
};

export const getHighValueDomains = (results: DomainResult[]): DomainScore[] => {
  const availableDomains = results.filter(result => result.status === 'available');
  
  const analyzedDomains = availableDomains
    .map(result => analyzeDomainValue(result.domain))
    .sort((a, b) => b.score - a.score);

  return analyzedDomains;
};