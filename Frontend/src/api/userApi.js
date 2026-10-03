// User Management API Service for Administrator Console
import { authApi } from './authApi';

let mockUsers = [
  { _id: 'u-1', name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'employee', department: 'Human Resources', status: 'active', createdAt: '2024-01-10' },
  { _id: 'u-2', name: 'Mohiddin Employee', email: 'mohiddin@company.com', role: 'employee', department: 'Product & Engineering', status: 'active', createdAt: '2024-02-14' },
  { _id: 'u-3', name: 'Dave Tech', email: 'dave@company.com', role: 'technician', department: 'IT Infrastructure', status: 'active', createdAt: '2024-03-01' },
  { _id: 'u-4', name: 'Rahul Sharma', email: 'rahul@company.com', role: 'technician', department: 'IT Infrastructure', status: 'active', createdAt: '2024-03-15' },
  { _id: 'u-5', name: 'Priya Manager', email: 'priya@company.com', role: 'it_manager', department: 'IT Operations', status: 'active', createdAt: '2023-11-01' },
  { _id: 'u-6', name: 'Marcus Asset', email: 'marcus@company.com', role: 'asset_manager', department: 'IT Procurement', status: 'active', createdAt: '2024-01-20' },
  { _id: 'u-7', name: 'Alex Admin', email: 'admin@company.com', role: 'system_admin', department: 'Executive IT Administration', status: 'active', createdAt: '2023-08-01' }
];

export const userApi = {
  getAll: async () => {
    return [...mockUsers];
  },

  create: async (userData) => {
    // Attempt backend registration first
    try {
      await authApi.register({
        name: userData.name,
        email: userData.email,
        password: userData.password || 'TemporaryPassword123!',
        role: userData.role || 'employee',
        department: userData.department
      });
    } catch (e) {
      console.warn("Backend register call handled or fallback used:", e.message);
    }

    const newUser = {
      _id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'employee',
      department: userData.department || 'General',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    mockUsers.unshift(newUser);
    return newUser;
  },

  updateRole: async (id, role) => {
    mockUsers = mockUsers.map(u => u._id === id ? { ...u, role } : u);
    return { success: true };
  },

  toggleStatus: async (id) => {
    mockUsers = mockUsers.map(u => {
      if (u._id === id) {
        return { ...u, status: u.status === 'active' ? 'deactivated' : 'active' };
      }
      return u;
    });
    return { success: true };
  }
};
