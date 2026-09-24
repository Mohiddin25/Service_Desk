// Unified API Client for ServiceDesk Pro
// Aggregates all service APIs into namespaced groups

import { aiApi } from './aiApi';
import { ticketApi } from './ticketApi';
import { assetApi } from './assetApi';
import { userApi } from './userApi';

export const api = {
  ai: {
    query: (queryText) => aiApi.query(queryText),
    addFaq: (questionOrObj, answer) => {
      // Support both object form { question, answer } and (question, answer) args
      if (typeof questionOrObj === 'string') {
        return aiApi.addFaq({ question: questionOrObj, answer });
      }
      return aiApi.addFaq(questionOrObj);
    },
    addBulkFaqs: (faqs) => aiApi.addBulkFaqs(faqs),
    getFaqs: () => aiApi.getFaqs(),
    deleteFaq: (id) => aiApi.deleteFaq(id),
  },

  tickets: {
    getAll: (filters) => ticketApi.getAll(filters),
    create: (data, user) => ticketApi.create(data, user),
    updateStatus: (id, status) => ticketApi.updateStatus(id, status),
    assign: (id, techName) => ticketApi.assign(id, techName),
  },

  assets: {
    getAll: () => assetApi.getAll(),
    create: (data) => assetApi.create(data),
    updateStatus: (id, status) => assetApi.updateStatus(id, status),
  },

  users: {
    getAll: () => userApi.getAll(),
    create: (data) => userApi.create(data),
    updateRole: (id, role) => userApi.updateRole(id, role),
    toggleStatus: (id) => userApi.toggleStatus(id),
  },

  notifications: (() => {
    let notifs = [
      { id: 'n-1', type: 'breach', title: 'SLA Breach Alert', message: 'TCK-20260924-42B8 (MacBook Screen Flickering) has exceeded the 2-hour critical SLA deadline.', timestamp: '5 mins ago', isRead: false },
      { id: 'n-2', type: 'assignment', title: 'Ticket Assigned to You', message: 'TCK-20260924-90A1 (VPN Connection Timeout) has been assigned to Dave Tech.', timestamp: '22 mins ago', isRead: false },
      { id: 'n-3', type: 'kb', title: 'Knowledge Base Updated', message: 'FAQ-006 "How to setup Cisco VPN on macOS" has been ingested into Pinecone vector index.', timestamp: '1 hour ago', isRead: true },
    ];
    return {
      getAll: async () => notifs,
      markAsRead: async (id) => { notifs = notifs.map(n => n.id === id ? { ...n, isRead: true } : n); return { success: true }; },
      clearAll: async () => { notifs = []; return { success: true }; },
    };
  })(),
};

