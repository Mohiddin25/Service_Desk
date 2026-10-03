// Centralized Knowledge Base API Service
const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('servicedesk_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

let mockFaqs = [
  {
    id: 'FAQ-001',
    question: 'How do I connect to office Wi-Fi?',
    category: 'Network',
    answer: 'Select "Corp_Secure" from the available Wi-Fi networks. Authenticate with your company email and password. Trust the corporate certificate when prompted. If connecting on mobile, ensure PEAP and MSCHAPv2 are selected.',
    updatedAt: '2 days ago'
  },
  {
    id: 'FAQ-002',
    question: 'How do I reset my Windows / Mac domain password?',
    category: 'Account',
    answer: 'Navigate to https://identity.company.com/selfservice. Verify your identity using multi-factor authentication. Choose a new password of at least 12 characters with mixed case, numbers, and symbols.',
    updatedAt: '1 week ago'
  },
  {
    id: 'FAQ-003',
    question: 'How do I request software licenses or install applications?',
    category: 'Software',
    answer: 'Open the Company Portal (Windows) or Jamf Self Service (macOS). Search for approved applications and click Install. For paid software licenses like JetBrains, Figma Pro, or Adobe CC, submit an IT Ticket with your department code.',
    updatedAt: '3 days ago'
  },
  {
    id: 'FAQ-004',
    question: 'How do I troubleshoot VPN connection timeouts?',
    category: 'Network',
    answer: 'Ensure your home internet connection is stable. Open Cisco AnyConnect, click the gear icon to verify the gateway address is vpn.company.com, and reconnect. If still failing, disconnect any personal VPNs and restart your router.',
    updatedAt: '5 days ago'
  },
  {
    id: 'FAQ-005',
    question: 'How do I resolve external monitor display flickering?',
    category: 'Hardware',
    answer: '1. Lower the display refresh rate from 120/144Hz to 60Hz in Display Settings.\n2. Disconnect and reconnect the USB-C / Thunderbolt docking station.\n3. Verify dock firmware is updated via the Dell/Lenovo Command utility.\n4. Avoid connecting through daisy-chained adapters.',
    updatedAt: 'Just now'
  },
  {
    id: 'FAQ-006',
    question: 'How do I report a suspicious email or phishing attempt?',
    category: 'Security',
    answer: 'In Microsoft Outlook, select the email and click the "Report Phishing" button located in the Home ribbon. Do NOT click any hyperlinks or download attachments. Security Operations will investigate within 30 minutes.',
    updatedAt: '2 weeks ago'
  }
];

export const knowledgeApi = {
  getAll: async () => {
    return [...mockFaqs];
  },

  addFaq: async (faqData) => {
    try {
      const res = await fetch(`${API_BASE}/ai/knowledge/faq`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          question: faqData.question,
          answer: faqData.answer,
          category: faqData.category || 'General'
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newFaq = {
      id: `FAQ-${String(mockFaqs.length + 1).padStart(3, '0')}`,
      question: faqData.question,
      category: faqData.category || 'General',
      answer: faqData.answer,
      updatedAt: 'Just now'
    };
    mockFaqs.unshift(newFaq);
    return newFaq;
  },

  addBulkFaqs: async (faqsArray) => {
    try {
      const res = await fetch(`${API_BASE}/ai/knowledge/faqs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ faqs: faqsArray })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const formatted = faqsArray.map((item, idx) => ({
      id: `FAQ-${String(mockFaqs.length + idx + 1).padStart(3, '0')}`,
      question: item.question,
      category: item.category || 'General',
      answer: item.answer,
      updatedAt: 'Just now'
    }));
    mockFaqs = [...formatted, ...mockFaqs];
    return { count: formatted.length, success: true };
  }
};
