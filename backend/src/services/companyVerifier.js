/**
 * Company Identity & Official Source Verification Service
 * Safely normalizes domains, checks against verified registry mappings,
 * flags spoofing/lookalike domains, and generates safe manual verification steps.
 */

// Trusted directory of verified organizations and official careers portals
const VERIFIED_DIRECTORY = [
  {
    name: 'Google',
    aliases: ['google llc', 'google cloud', 'alphabet', 'google india'],
    canonicalDomain: 'google.com',
    careerPortal: 'https://careers.google.com',
    industry: 'Technology / Cloud Services',
    registryUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001652044',
    mcaCin: null
  },
  {
    name: 'Microsoft',
    aliases: ['microsoft corporation', 'microsoft india', 'msft'],
    canonicalDomain: 'microsoft.com',
    careerPortal: 'https://careers.microsoft.com',
    industry: 'Technology / Software',
    registryUrl: 'https://www.sec.gov/edgar/browse/?CIK=0000789019',
    mcaCin: null
  },
  {
    name: 'Amazon',
    aliases: ['amazon.com', 'amazon development centre', 'aws', 'amazon web services'],
    canonicalDomain: 'amazon.jobs',
    careerPortal: 'https://amazon.jobs',
    industry: 'E-commerce & Cloud Computing',
    registryUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001018724',
    mcaCin: null
  },
  {
    name: 'Infosys Limited',
    aliases: ['infosys', 'infosys bpm', 'infy'],
    canonicalDomain: 'infosys.com',
    careerPortal: 'https://careers.infosys.com',
    industry: 'IT Services & Consulting',
    registryUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
    mcaCin: 'L85110KA1981PLC013115'
  },
  {
    name: 'Tata Consultancy Services',
    aliases: ['tcs', 'tata consultancy services limited'],
    canonicalDomain: 'tcs.com',
    careerPortal: 'https://ibegin.tcs.com',
    industry: 'IT Services & Business Solutions',
    registryUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
    mcaCin: 'L22210MH1995PLC084781'
  },
  {
    name: 'Wipro Limited',
    aliases: ['wipro'],
    canonicalDomain: 'wipro.com',
    careerPortal: 'https://careers.wipro.com',
    industry: 'IT Services & Digital Transformation',
    registryUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
    mcaCin: 'L32102KA1945PLC020800'
  },
  {
    name: 'Razorpay',
    aliases: ['razorpay software private limited', 'razorpay payments'],
    canonicalDomain: 'razorpay.com',
    careerPortal: 'https://razorpay.com/jobs',
    industry: 'Fintech & Payment Gateway',
    registryUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
    mcaCin: 'U72200KA2013PTC097389'
  },
  {
    name: 'Accenture',
    aliases: ['accenture solutions private limited', 'accenture india'],
    canonicalDomain: 'accenture.com',
    careerPortal: 'https://www.accenture.com/careers',
    industry: 'Consulting & Professional Services',
    registryUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001467373',
    mcaCin: null
  }
];

/**
 * Clean & normalize domain name (strips protocol, port, paths, www)
 */
export function normalizeDomain(urlOrDomain = '') {
  if (!urlOrDomain) return '';
  let cleaned = urlOrDomain.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split(':')[0];
  return cleaned;
}

/**
 * Verify company credentials against curated authoritative registers
 */
export function verifyCompanyIdentity({ companyName = '', companyWebsite = '', recruiterContact = '' }) {
  const normName = companyName.trim().toLowerCase();
  const submittedDomain = normalizeDomain(companyWebsite);
  const contactDomain = recruiterContact.includes('@') ? recruiterContact.split('@')[1].trim().toLowerCase() : '';

  if (!normName && !submittedDomain) {
    return {
      status: 'unverified',
      isVerified: false,
      officialSourceFound: false,
      message: 'No company name or website provided for verification.',
      verificationNotes: 'Provide a formal registered corporate name or website domain to check verified records.',
      safeManualSteps: [
        'Check Ministry of Corporate Affairs (MCA) database for active Indian corporate registrations.',
        'Search the official LinkedIn company page with more than 1,000 employees and verified badge.',
        'Look up domain WHOIS records at whois.domaintools.com to check creation date (new domains <6 months old are high risk).'
      ]
    };
  }

  // Look up known entry
  const matchedEntry = VERIFIED_DIRECTORY.find(entry => {
    const nameMatch = entry.name.toLowerCase() === normName || entry.aliases.includes(normName) || normName.includes(entry.name.toLowerCase());
    const domainMatch = submittedDomain && (submittedDomain === entry.canonicalDomain || submittedDomain.endsWith('.' + entry.canonicalDomain));
    return nameMatch || domainMatch;
  });

  if (matchedEntry) {
    let domainMismatch = false;
    let mismatchDetails = '';

    // Check if user entered website or contact domain diverges from canonical domain
    if (submittedDomain && !submittedDomain.includes(matchedEntry.canonicalDomain)) {
      domainMismatch = true;
      mismatchDetails = `User-supplied website "${submittedDomain}" does NOT match official registered domain "${matchedEntry.canonicalDomain}". Scammers often construct lookalike sites.`;
    }

    if (contactDomain && !contactDomain.includes(matchedEntry.canonicalDomain)) {
      domainMismatch = true;
      mismatchDetails += ` Recruiter contact uses "${contactDomain}" instead of verified domain "@${matchedEntry.canonicalDomain}".`;
    }

    return {
      status: domainMismatch ? 'domain_mismatch_warning' : 'official_source_found',
      isVerified: !domainMismatch,
      officialSourceFound: true,
      officialName: matchedEntry.name,
      canonicalDomain: matchedEntry.canonicalDomain,
      careerPortal: matchedEntry.careerPortal,
      industry: matchedEntry.industry,
      mcaCin: matchedEntry.mcaCin || null,
      registryUrl: matchedEntry.registryUrl,
      flaggedDomainMismatch: domainMismatch,
      verificationNotes: domainMismatch
        ? `⚠️ Potential Domain Impersonation Detected! While "${matchedEntry.name}" is a legitimate known enterprise, the submitted details appear to be an impersonation attempt. ${mismatchDetails}`
        : `✅ Official source established. Found verified careers portal for "${matchedEntry.name}". Compare offer details exclusively through the verified portal.`,
      sourceLinks: [
        { label: `Official ${matchedEntry.name} Careers Portal`, url: matchedEntry.careerPortal, type: 'official-portal' },
        { label: 'Regulatory Filings / Registry Link', url: matchedEntry.registryUrl, type: 'regulatory' }
      ],
      safeManualSteps: [
        `Navigate directly to ${matchedEntry.careerPortal} and search for the Job ID listed in your offer.`,
        'Never reply to emails originating outside the official corporate domain.',
        'Contact the corporate talent acquisition fraud team if unsolicited fees are solicited.'
      ]
    };
  }

  // General unverified entity
  return {
    status: 'unverified_entity',
    isVerified: false,
    officialSourceFound: false,
    officialName: companyName || 'Unregistered Entity',
    canonicalDomain: submittedDomain || 'Not provided',
    careerPortal: null,
    flaggedDomainMismatch: false,
    verificationNotes: `Company "${companyName || submittedDomain}" was not found in our curated verified enterprise directory. This does not automatically prove it is fraudulent (it may be a newly incorporated startup or local business), but independent verification is mandatory.`,
    safeManualSteps: [
      'Search Ministry of Corporate Affairs: Go to mca.gov.in -> View Company Master Data to check active incorporation status and registered directors.',
      'Check Domain Age: Check the domain registration date on who.is. Fraudulent job sites are frequently registered within the past 30-90 days.',
      'Physical Office Inspection: Search Google Maps and corporate directories for physical office existence and landline contact numbers.',
      'Campus TPO Validation: Inquire with your college Training & Placement Officer (TPO) whether this employer has participated in accredited placement drives.'
    ],
    sourceLinks: [
      { label: 'Ministry of Corporate Affairs (MCA) Portal', url: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do', type: 'government-registry' },
      { label: 'Domain Age & WHOIS Lookup', url: 'https://who.is', type: 'utility' }
    ]
  };
}
