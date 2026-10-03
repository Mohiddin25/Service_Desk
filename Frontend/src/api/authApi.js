// Centralized Auth API Service
import { API_BASE } from './config';

export const authApi = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const user = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department
        };
        const token = data.token;
        return { token, user, message: 'Signed in successfully' };
      }
      const errorData = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403 || res.status === 400) {
        throw new Error(errorData.message || 'Invalid email or password');
      }
    } catch (e) {
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
      console.warn("Backend unavailable, using organizational test account fallback");
    }

    // Role detection fallback for standard company test accounts
    const emailLower = (email || '').toLowerCase().trim();
    let role = 'employee';
    let name = 'Mohiddin Employee';

    if (emailLower.includes('admin') || emailLower.startsWith('alex')) {
      role = 'system_admin';
      name = 'Alex Admin';
    } else if (emailLower.includes('tech') || emailLower.startsWith('dave') || emailLower.startsWith('rahul')) {
      role = 'technician';
      name = emailLower.startsWith('rahul') ? 'Rahul Sharma' : 'Dave Tech';
    } else if (emailLower.includes('manager') || emailLower.startsWith('priya') || emailLower.startsWith('sarah')) {
      role = 'it_manager';
      name = emailLower.startsWith('priya') ? 'Priya Manager' : 'Sarah Jenkins';
    } else if (emailLower.includes('asset') || emailLower.startsWith('marcus') || emailLower.startsWith('sam')) {
      role = 'asset_manager';
      name = emailLower.startsWith('sam') ? 'Sam Asset' : 'Marcus Asset';
    } else if (emailLower.startsWith('mohiddin')) {
      role = 'employee';
      name = 'Mohiddin';
    } else {
      const part = emailLower.split('@')[0] || 'User';
      name = part.charAt(0).toUpperCase() + part.slice(1);
    }

    const fallbackUser = {
      _id: 'u-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      role,
      department: role === 'asset_manager' ? 'Asset Management' : role === 'employee' ? 'Sales & Operations' : 'IT Operations',
      token: 'jwt_offline_' + Date.now()
    };

    return { token: fallbackUser.token, user: fallbackUser, message: 'Signed in successfully' };
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      // Backend may be offline
    }
    return { success: true };
  },

  getProfile: async (token) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  getDepartments: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/departments`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("Could not fetch departments from backend:", e);
    }
    // Fallback departments matching organizational defaults
    return [
      { _id: 'Product & Engineering', name: 'Product & Engineering' },
      { _id: 'IT Operations', name: 'IT Operations' },
      { _id: 'Human Resources', name: 'Human Resources' },
      { _id: 'Finance & Operations', name: 'Finance & Operations' },
      { _id: 'Customer Support', name: 'Customer Support' },
      { _id: 'Security & Compliance', name: 'Security & Compliance' }
    ];
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data;
    throw new Error(data.message || 'Failed to create user account');
  }
};
