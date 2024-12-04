export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const checkDomainAvailability = async (domain: string): Promise<boolean> => {
  try {
    // Clean the domain name
    const cleanDomain = domain.trim().toLowerCase();
    
    // Use multiple DNS endpoints for redundancy
    const endpoints = [
      `https://dns.google/resolve?name=${cleanDomain}&type=SOA`,
      `https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=SOA`
    ];

    // Try each endpoint until we get a successful response
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/dns-json'
          }
        });

        if (!response.ok) continue;

        const data = await response.json();

        // Check for SOA (Start of Authority) record
        // SOA record is the most reliable indicator of domain registration
        if (data.Answer && data.Answer.length > 0) {
          return false; // Domain is registered
        }

        // Check if we got a successful response with no records
        if (data.Status === 0 || data.Status === 3) {
          // Status 0 = No error, Status 3 = Name Error (NXDOMAIN)
          // If we get NXDOMAIN, the domain likely doesn't exist
          return true; // Domain might be available
        }
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        continue; // Try next endpoint
      }
    }

    // If all endpoints failed or were inconclusive, assume domain is registered
    // This is a conservative approach to avoid false positives
    return false;
  } catch (error) {
    console.error(`Error checking domain ${domain}:`, error);
    return false; // Assume domain is not available in case of errors
  }
};

export const processDomainBatch = async (
  domains: string[],
  timeout: number
): Promise<Map<string, boolean>> => {
  const results = new Map<string, boolean>();
  
  // Process domains sequentially to avoid rate limiting and improve reliability
  for (const domain of domains) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const isAvailable = await checkDomainAvailability(domain);
      clearTimeout(timeoutId);
      results.set(domain, isAvailable);
      
      // Add a delay between requests to respect rate limits
      // This helps prevent blocking and improves reliability
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error processing domain ${domain}:`, error);
      results.set(domain, false); // Conservative approach: assume registered if error
    }
  }
  
  return results;
};

export const exportDomains = (
  results: { domain: string; status: string }[],
  type: 'available' | 'registered'
): string => {
  const filteredDomains = results
    .filter(result => result.status === type)
    .map(result => result.domain)
    .join('\n');
  
  return filteredDomains;
};