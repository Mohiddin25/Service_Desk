// Centralized Asset Management API Service
const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('servicedesk_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

let mockAssets = [
  {
    _id: 'ast-101',
    assetTag: 'AST-001',
    name: 'MacBook Pro 16" M3 Max',
    category: 'laptop',
    modelNumber: 'MacBookPro18,1',
    serialNumber: 'C02G879XMD6R',
    status: 'assigned',
    assignedTo: { _id: 'u-2', name: 'Mohiddin Employee', email: 'mohiddin@company.com' },
    department: { _id: 'd-1', name: 'Engineering', code: 'ENG' },
    purchaseDate: '2024-01-15',
    warrantyExpiration: '2027-01-15',
    cost: 3499,
    notes: 'Primary developer workstation with 64GB RAM.'
  },
  {
    _id: 'ast-102',
    assetTag: 'AST-002',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'peripheral',
    modelNumber: 'U3223QE',
    serialNumber: 'CN-098712-441',
    status: 'in_inventory',
    assignedTo: null,
    department: { _id: 'd-2', name: 'IT Infrastructure', code: 'IT' },
    purchaseDate: '2023-06-10',
    warrantyExpiration: '2026-06-10',
    cost: 850,
    notes: 'Available in Floor 3 IT storage rack.'
  },
  {
    _id: 'ast-103',
    assetTag: 'AST-003',
    name: 'ThinkPad T14s Gen 4',
    category: 'laptop',
    modelNumber: '21F8002FUS',
    serialNumber: 'PF4X982L',
    status: 'assigned',
    assignedTo: { _id: 'u-1', name: 'Sarah Jenkins', email: 'sarah@company.com' },
    department: { _id: 'd-3', name: 'Human Resources', code: 'HR' },
    purchaseDate: '2023-11-20',
    warrantyExpiration: '2026-11-20',
    cost: 1650,
    notes: 'Standard staff laptop issue.'
  },
  {
    _id: 'ast-104',
    assetTag: 'AST-004',
    name: 'Cisco Meraki Wi-Fi 6 Access Point',
    category: 'network',
    modelNumber: 'MR46-HW',
    serialNumber: 'Q2KD-9912-MR46',
    status: 'under_repair',
    assignedTo: null,
    department: { _id: 'd-2', name: 'IT Infrastructure', code: 'IT' },
    purchaseDate: '2023-02-14',
    warrantyExpiration: '2028-02-14',
    cost: 1200,
    notes: 'RMA replacement pending with vendor.'
  },
  {
    _id: 'ast-105',
    assetTag: 'AST-005',
    name: 'iPad Pro 12.9" M2',
    category: 'mobile',
    modelNumber: 'MNXQ3LL/A',
    serialNumber: 'DMP8920LK4',
    status: 'retired',
    assignedTo: null,
    department: { _id: 'd-4', name: 'Executive', code: 'EXEC' },
    purchaseDate: '2022-04-10',
    warrantyExpiration: '2024-04-10',
    cost: 1199,
    notes: 'Decommissioned following refresh cycle.'
  }
];

export const assetApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit || 50);

      const res = await fetch(`${API_BASE}/assets?${query.toString()}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.assets)) return data.assets;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("Assets API fetch fallback:", e.message);
    }

    let filtered = [...mockAssets];
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(a => a.status === params.status);
    }
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(a => a.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(a =>
        a.assetTag.toLowerCase().includes(s) ||
        a.name.toLowerCase().includes(s) ||
        (a.assignedTo && a.assignedTo.name && a.assignedTo.name.toLowerCase().includes(s))
      );
    }
    return filtered;
  },

  getMyAssets: async () => {
    try {
      const res = await fetch(`${API_BASE}/assets/my-assets`, {
        headers: getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    // Return first 1 or 2 assets for current employee demo
    return mockAssets.filter(a => a.status === 'assigned');
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        headers: getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockAssets.find(a => a._id === id || a.assetTag === id) || null;
  },

  create: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/assets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newTag = 'AST-' + String(mockAssets.length + 1).padStart(3, '0');
    const newAsset = {
      _id: `ast-${Date.now()}`,
      assetTag: newTag,
      name: data.name,
      category: data.category || 'other',
      modelNumber: data.modelNumber || '',
      serialNumber: data.serialNumber || '',
      status: data.status || 'in_inventory',
      assignedTo: data.assignedToName ? { name: data.assignedToName } : null,
      department: data.department ? { name: data.department } : null,
      purchaseDate: data.purchaseDate || new Date().toISOString().slice(0, 10),
      warrantyExpiration: data.warrantyExpiration || '',
      cost: data.cost ? parseFloat(data.cost) : 0,
      notes: data.notes || ''
    };
    mockAssets.unshift(newAsset);
    return newAsset;
  },

  update: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    mockAssets = mockAssets.map(a => a._id === id ? { ...a, ...data } : a);
    return { success: true };
  },

  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    mockAssets = mockAssets.map(a => a._id === id ? { ...a, status } : a);
    return { success: true };
  },

  assign: async (id, { userId, departmentId }) => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}/assign`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ userId, departmentId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return { success: true };
  },

  delete: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    mockAssets = mockAssets.filter(a => a._id !== id);
    return { success: true };
  }
};
