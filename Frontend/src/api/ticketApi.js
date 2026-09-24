// Ticket Management API service

const API_BASE = '/api';

let mockTickets = [
  {
    _id: 't-101',
    ticketNumber: 'TCK-20260924-90A1',
    title: 'VPN Connection Timeout on macOS Sequoia',
    description: 'User experiences timeout while attempting to connect to corporate Cisco VPN. Error code: 504 Gateway Timeout.',
    category: 'Network',
    priority: 'high',
    status: 'open',
    createdBy: { id: 'u-1', name: 'Mohiddin', email: 'mohiddin@company.com', role: 'employee', department: 'Product & Engineering' },
    assignedTo: null,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    firstResponse: null,
    resolutionDate: null,
    slaDeadline: new Date(Date.now() + 3600000 * 2).toISOString(),
    isSlaBreached: false
  },
  {
    _id: 't-102',
    ticketNumber: 'TCK-20260924-42B8',
    title: 'MacBook Air M2 Screen Flickering & Overheating',
    description: 'Hardware issue: Display flickers violently when connected to external 4K monitor over USB-C.',
    category: 'Hardware',
    priority: 'critical',
    status: 'assigned',
    createdBy: { id: 'u-2', name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'employee', department: 'Human Resources' },
    assignedTo: { id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    firstResponse: new Date(Date.now() - 3600000 * 4).toISOString(),
    resolutionDate: null,
    slaDeadline: new Date(Date.now() - 3600000 * 1).toISOString(),
    isSlaBreached: true
  },
  {
    _id: 't-103',
    ticketNumber: 'TCK-20260924-88C3',
    title: 'Figma Organization License Request',
    description: 'Need access to Figma Pro workspace for UI/UX Design team project.',
    category: 'Software',
    priority: 'low',
    status: 'resolved',
    createdBy: { id: 'u-1', name: 'Mohiddin', email: 'mohiddin@company.com', role: 'employee', department: 'Product & Engineering' },
    assignedTo: { id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    firstResponse: new Date(Date.now() - 3600000 * 23).toISOString(),
    resolutionDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    slaDeadline: new Date(Date.now() - 3600000 * 18).toISOString(),
    isSlaBreached: false
  }
];

export const ticketApi = {
  getAll: async () => {
    try {
    const token = localStorage.getItem('servicedesk_token');
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (res.ok) return await res.json();
    // fallback to mock data below
    } catch (e) {}
    return mockTickets;
  },

  create: async (ticketData, currentUser) => {
    const newTicket = {
      _id: `t-${Date.now()}`,
      ticketNumber: `TCK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      ...ticketData,
      status: 'open',
      createdBy: currentUser || { name: 'Mohiddin', email: 'mohiddin@company.com', role: 'employee' },
      assignedTo: null,
      createdAt: new Date().toISOString(),
      firstResponse: null,
      resolutionDate: null,
      slaDeadline: new Date(Date.now() + 3600000 * 4).toISOString(),
      isSlaBreached: false
    };
    mockTickets.unshift(newTicket);
    return newTicket;
  },

  updateStatus: async (id, status) => {
    mockTickets = mockTickets.map(t => t._id === id ? { ...t, status } : t);
    return { success: true };
  },

  assign: async (id, techName) => {
    mockTickets = mockTickets.map(t => t._id === id ? { ...t, status: 'assigned', assignedTo: { name: techName, role: 'technician' } } : t);
    return { success: true };
  }
};
