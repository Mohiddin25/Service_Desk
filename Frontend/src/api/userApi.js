// User Directory & Role-Based Access API service

let mockUsers = [
  { id: 'u-1', name: 'Mohiddin', email: 'mohiddin@company.com', role: 'it_manager', department: 'IT Infrastructure & Operations', status: 'Active', createdDate: '2024-01-10' },
  { id: 'u-2', name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'employee', department: 'Human Resources', status: 'Active', createdDate: '2024-02-15' },
  { id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician', department: 'IT Infrastructure & Operations', status: 'Active', createdDate: '2024-03-01' },
  { id: 'u-4', name: 'Marcus Asset', email: 'marcus@company.com', role: 'asset_manager', department: 'IT Operations', status: 'Active', createdDate: '2024-03-12' },
  { id: 'u-5', name: 'Alex Admin', email: 'admin@company.com', role: 'system_admin', department: 'Executive System Admin', status: 'Active', createdDate: '2024-01-01' }
];

export const userApi = {
  getAll: async () => mockUsers,

  create: async (userData) => {
    const newUser = {
      id: `u-${Date.now()}`,
      ...userData,
      status: 'Active',
      createdDate: new Date().toISOString().slice(0, 10)
    };
    mockUsers.unshift(newUser);
    return newUser;
  },

  updateRole: async (id, role) => {
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, role } : u);
    return { success: true };
  },

  toggleStatus: async (id) => {
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u);
    return { success: true };
  }
};
