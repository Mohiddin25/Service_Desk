// Asset Management API service

const API_BASE = '/api';

let mockAssets = [
  { _id: 'a-201', assetTag: 'AST-9021', name: 'MacBook Pro 16" M3 Max', type: 'Laptop', serialNumber: 'C02G879XMD6R', status: 'Assigned', assignedTo: 'Mohiddin', purchaseDate: '2024-01-15', warranty: '2027-01-15', vendor: 'Apple Inc.' },
  { _id: 'a-202', assetTag: 'AST-4412', name: 'Dell UltraSharp 32" 4K', type: 'Monitor', serialNumber: 'CN-098712-441', status: 'Under Maintenance', assignedTo: 'Sarah Jenkins', purchaseDate: '2023-06-10', warranty: '2026-06-10', vendor: 'Dell Tech' },
  { _id: 'a-203', assetTag: 'AST-1109', name: 'Cisco Meraki Wi-Fi 6 Router', type: 'Network Device', serialNumber: 'MR46-9921-X', status: 'Available', assignedTo: 'Unassigned', purchaseDate: '2024-03-20', warranty: '2028-03-20', vendor: 'Cisco Systems' },
  { _id: 'a-204', assetTag: 'AST-7801', name: 'JetBrains All Products Pack', type: 'Software License', serialNumber: 'JB-2026-KEY-9912', status: 'Assigned', assignedTo: 'Mohiddin', purchaseDate: '2025-02-01', warranty: '2026-02-01', vendor: 'JetBrains' }
];

export const assetApi = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockAssets;
  },

  create: async (assetData) => {
    const newAsset = {
      _id: `a-${Date.now()}`,
      assetTag: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      ...assetData
    };
    mockAssets.unshift(newAsset);
    return newAsset;
  },

  updateStatus: async (id, status) => {
    mockAssets = mockAssets.map(a => a._id === id ? { ...a, status } : a);
    return { success: true };
  }
};
