// AI RAG Service API Client reading VITE_AI_API_URL

const AI_API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

let mockFaqs = [
  { id: 'faq_001', category: 'network', question: 'How do I connect my laptop to office Wi-Fi?', answer: 'To connect your laptop to office Wi-Fi, open Wi-Fi settings, select the company network (SSID: Corp_Secure), and enter your company credentials.' },
  { id: 'faq_002', category: 'account', question: 'How do I reset my Windows password?', answer: 'Press Ctrl + Alt + Delete on your keyboard, select "Change a password", and follow the prompts. Or use Okta Self-Service.' },
  { id: 'faq_003', category: 'software', question: 'How do I install approved software?', answer: 'Open the Self-Service Software Portal on your computer, browse approved apps (Teams, Figma, Docker), and click Install.' },
  { id: 'faq_004', category: 'security', question: 'How do I report a suspicious email?', answer: 'Click the "Report Phishing" button in Outlook toolbar to alert the Information Security Operations Center.' },
  { id: 'faq_005', category: 'hardware', question: 'My laptop display flickers on 4K monitor dock', answer: 'Update USB-C dock firmware to v2.4, lower refresh rate from 144Hz to 60Hz in Display Settings.' }
];

export const aiApi = {
  // POST /rag/query
  query: async (queryText) => {
    try {
      const response = await fetch(`${AI_API_BASE}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      if (response.ok) {
        const data = await response.json();
        return { answer: data.answer, sources: data.sources || [], isLive: true };
      }
    } catch (err) {
      console.warn('FastAPI AI Service unreachable, using RAG simulator:', err.message);
    }

    // Intelligent local simulation
    const q = queryText.toLowerCase();
    let answer = "For IT issues, check self-service documentation or verify device network settings. If unresolved, raise a support ticket.";
    let sources = [];

    if (q.includes('wifi') || q.includes('wi-fi') || q.includes('internet') || q.includes('connect')) {
      answer = "To connect your laptop to office Wi-Fi, open Wi-Fi settings, select the company network, and enter your company credentials.";
      sources = [{ id: "faq_001", category: "network" }, { id: "faq_003", category: "network" }];
    } else if (q.includes('password') || q.includes('reset') || q.includes('windows')) {
      answer = "To reset your Windows password:\n1. Press Ctrl + Alt + Delete on your keyboard.\n2. Click on 'Change a password' or 'Reset password'.\n3. Follow the on-screen instructions.\n4. If you don't see the option, contact the IT support team for assistance.";
      sources = [{ id: "faq_002", category: "account" }];
    } else if (q.includes('software') || q.includes('install') || q.includes('approved')) {
      answer = "To install approved company software, launch the Self-Service Portal on your laptop, select the desired software (e.g. Teams, Figma, JetBrains), and click Install.";
      sources = [{ id: "faq_003", category: "software" }];
    } else if (q.includes('suspicious') || q.includes('email') || q.includes('phishing')) {
      answer = "To report a suspicious email, click the 'Report Phishing' button in the Outlook toolbar. Do not click links or open attachments.";
      sources = [{ id: "faq_004", category: "security" }];
    }

    return { answer, sources, isLive: false };
  },

  // POST /knowledge/faq
  addFaq: async (faqData) => {
    try {
      const response = await fetch(`${AI_API_BASE}/knowledge/faq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData)
      });
      if (response.ok) return await response.json();
    } catch (err) {}

    const newFaq = {
      id: faqData.id || `faq_${String(mockFaqs.length + 1).padStart(3, '0')}`,
      category: faqData.category || 'general',
      question: faqData.question,
      answer: faqData.answer
    };
    mockFaqs.unshift(newFaq);
    return { success: true, faq: newFaq };
  },

  // POST /knowledge/faqs
  addBulkFaqs: async (faqsArray) => {
    try {
      const response = await fetch(`${AI_API_BASE}/knowledge/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqsArray)
      });
      if (response.ok) return await response.json();
    } catch (err) {}

    const added = faqsArray.map((item, idx) => ({
      id: item.id || `faq_bulk_${Date.now()}_${idx}`,
      category: item.category || 'general',
      question: item.question,
      answer: item.answer
    }));
    mockFaqs = [...added, ...mockFaqs];
    return { count: added.length, success: true };
  },

  getFaqs: async () => mockFaqs,
  deleteFaq: async (id) => {
    mockFaqs = mockFaqs.filter(f => f.id !== id);
    return { success: true };
  }
};
