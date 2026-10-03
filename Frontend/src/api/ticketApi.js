// Centralized Ticket Management API Service
const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('servicedesk_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Initial realistic dataset for enterprise demonstration if offline
let mockTickets = [
  {
    _id: 't-101',
    ticketNumber: 'INC-1024',
    title: 'Wi-Fi connection problem on 4th Floor',
    description: 'Corporate laptop fails to maintain connection to Corp_Secure wireless network on 4th floor East Wing. Signal drops every 10 minutes.',
    category: 'network',
    priority: 'high',
    status: 'in_progress',
    createdBy: { _id: 'u-1', name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'employee', department: 'Human Resources' },
    assignedTo: { _id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    firstRespondedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    slaStatus: 'at_risk',
    slaTimeRemaining: '45 mins remaining',
  },
  {
    _id: 't-102',
    ticketNumber: 'INC-1023',
    title: 'MacBook Air M2 Screen Flickering with 4K Dock',
    description: 'External monitor display flickers violently when connected via CalDigit USB-C dock. Multiple HDMI cables tested with same result.',
    category: 'hardware',
    priority: 'critical',
    status: 'assigned',
    createdBy: { _id: 'u-2', name: 'Mohiddin Employee', email: 'mohiddin@company.com', role: 'employee', department: 'Product & Engineering' },
    assignedTo: { _id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    firstRespondedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    slaStatus: 'breached',
    slaTimeRemaining: 'Breached by 1h 15m',
  },
  {
    _id: 't-103',
    ticketNumber: 'INC-1022',
    title: 'Self-service password reset synchronization failure',
    description: 'User reset Active Directory password via portal, but macOS FileVault and local login are locked out and not accepting new credentials.',
    category: 'account_access',
    priority: 'medium',
    status: 'open',
    createdBy: { _id: 'u-4', name: 'Rachel Green', email: 'rachel@company.com', role: 'employee', department: 'Finance' },
    assignedTo: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    slaStatus: 'on_track',
    slaTimeRemaining: '3h 20m remaining',
  },
  {
    _id: 't-104',
    ticketNumber: 'INC-1021',
    title: 'VPN client handshake error 504 Gateway Timeout',
    description: 'Cannot establish remote tunnel through Cisco AnyConnect VPN client. Remote workers encountering DNS resolution timeouts.',
    category: 'network',
    priority: 'high',
    status: 'open',
    createdBy: { _id: 'u-5', name: 'Marcus Asset', email: 'marcus@company.com', role: 'asset_manager', department: 'IT Operations' },
    assignedTo: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    slaStatus: 'at_risk',
    slaTimeRemaining: '20 mins remaining',
  },
  {
    _id: 't-105',
    ticketNumber: 'INC-1020',
    title: 'Figma Organization license seat request',
    description: 'New product designer joining team needs seat assigned under Enterprise organization account.',
    category: 'software',
    priority: 'low',
    status: 'resolved',
    createdBy: { _id: 'u-2', name: 'Mohiddin Employee', email: 'mohiddin@company.com', role: 'employee', department: 'Product & Engineering' },
    assignedTo: { _id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    firstRespondedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    slaStatus: 'on_track',
    slaTimeRemaining: 'Resolved within SLA',
  },
  {
    _id: 't-106',
    ticketNumber: 'INC-1019',
    title: 'Suspicious phishing email reporting verification',
    description: 'Received email claiming to be from Payroll requesting banking verification. Link redirects to external suspicious domain.',
    category: 'security',
    priority: 'critical',
    status: 'resolved',
    createdBy: { _id: 'u-1', name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'employee', department: 'Human Resources' },
    assignedTo: { _id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician' },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    slaStatus: 'on_track',
    slaTimeRemaining: 'Resolved within SLA',
  }
];

let mockComments = {
  't-101': [
    {
      _id: 'c-1',
      ticket: 't-101',
      user: { _id: 'u-3', name: 'Dave Tech', role: 'technician' },
      message: 'Inspected floor access point AP-4E; checking controller logs for RF interference.',
      isInternal: true,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      _id: 'c-2',
      ticket: 't-101',
      user: { _id: 'u-3', name: 'Dave Tech', role: 'technician' },
      message: 'Hi Sarah, we are currently testing the AP channel frequency. Please let us know if your laptop reconnects automatically.',
      isInternal: false,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ],
  't-102': [
    {
      _id: 'c-3',
      ticket: 't-102',
      user: { _id: 'u-3', name: 'Dave Tech', role: 'technician' },
      message: 'Replaced USB-C Thunderbolt cable and scheduled firmware update on dock.',
      isInternal: true,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ]
};

export const ticketApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.priority) query.append('priority', params.priority);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit || 50);

      const res = await fetch(`${API_BASE}/tickets?${query.toString()}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { tickets, page, pages, total }
        if (data && Array.isArray(data.tickets)) {
          return data.tickets;
        } else if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (e) {
      console.warn("Tickets API fetch fallback:", e.message);
    }

    // Client-side filtering when backend is offline
    let filtered = [...mockTickets];
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(t => t.status === params.status);
    }
    if (params.priority && params.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === params.priority);
    }
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(t => t.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(t =>
        (t.ticketNumber && t.ticketNumber.toLowerCase().includes(s)) ||
        (t.title && t.title.toLowerCase().includes(s)) ||
        (t.description && t.description.toLowerCase().includes(s))
      );
    }
    return filtered;
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        headers: getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockTickets.find(t => t._id === id || t.ticketNumber === id) || null;
  },

  create: async (ticketData) => {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category || 'other',
          priority: ticketData.priority || 'medium'
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback ticket creation
    const newInc = 'INC-' + Math.floor(1025 + Math.random() * 50);
    const newTicket = {
      _id: `t-${Date.now()}`,
      ticketNumber: newInc,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category || 'other',
      priority: ticketData.priority || 'medium',
      status: 'open',
      createdBy: ticketData.currentUser || { _id: 'u-1', name: 'Current User', role: 'employee' },
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaStatus: 'on_track',
      slaTimeRemaining: '4h 00m remaining'
    };
    mockTickets.unshift(newTicket);
    return newTicket;
  },

  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    mockTickets = mockTickets.map(t => {
      if (t._id === id || t.ticketNumber === id) {
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' ? new Date().toISOString() : t.resolvedAt
        };
      }
      return t;
    });
    return { success: true, status };
  },

  assign: async (id, technicianId) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/assign`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ technicianId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    mockTickets = mockTickets.map(t => {
      if (t._id === id || t.ticketNumber === id) {
        return {
          ...t,
          status: t.status === 'open' ? 'assigned' : t.status,
          assignedTo: { _id: technicianId || 'u-3', name: 'Dave Tech', role: 'technician' },
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    return { success: true };
  },

  getComments: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/comments`, {
        headers: getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockComments[id] || [];
  },

  addComment: async (id, { message, isInternal = false, currentUser }) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, isInternal })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newComment = {
      _id: `c-${Date.now()}`,
      ticket: id,
      user: currentUser || { _id: 'u-current', name: 'Technician', role: 'technician' },
      message,
      isInternal,
      createdAt: new Date().toISOString()
    };

    if (!mockComments[id]) mockComments[id] = [];
    mockComments[id].push(newComment);
    return newComment;
  }
};
