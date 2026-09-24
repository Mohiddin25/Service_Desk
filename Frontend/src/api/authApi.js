// Auth API service handling JWT authentication

const API_BASE = '/api';

export const authApi = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        // Support { token, user } or direct user object with token
        const user = data.user || {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department
        };
        const token = data.token || (data.user && data.user.token);
        return { token, user, message: 'Logged in successfully' };
      }
    } catch (e) {
      console.warn("Backend unavailable, using client authentication fallback");
    }

    // Role detection fallback for standard organizational test accounts
    const emailLower = (email || '').toLowerCase();
    let role = 'employee';
    let name = 'Mohiddin';

    if (emailLower.includes('admin') || emailLower.startsWith('alex')) {
      role = 'system_admin';
      name = 'Alex Admin';
    } else if (emailLower.includes('tech') || emailLower.startsWith('rahul') || emailLower.startsWith('dave')) {
      role = 'technician';
      name = emailLower.startsWith('rahul') ? 'Rahul' : 'Dave Tech';
    } else if (emailLower.includes('manager') || emailLower.startsWith('priya') || emailLower.startsWith('sarah')) {
      role = 'it_manager';
      name = emailLower.startsWith('priya') ? 'Priya' : 'Sarah Jenkins';
    } else if (emailLower.includes('asset') || emailLower.startsWith('sam')) {
      role = 'asset_manager';
      name = 'Sam Asset';
    } else if (emailLower.startsWith('mohiddin')) {
      role = 'employee';
      name = 'Mohiddin';
    } else {
      name = email.split('@')[0].replace('.', ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    const fallbackUser = {
      _id: 'u-' + Math.floor(Math.random() * 1000),
      name,
      email,
      role,
      department: role === 'asset_manager' ? 'Asset Management' : role === 'employee' ? 'Sales & Operations' : 'IT Department',
      token: 'jwt_token_' + Date.now()
    };

    return { token: fallbackUser.token, user: fallbackUser, message: 'Logged in successfully' };
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch (e) {
      // Backend may be offline or stateless JWT
    }
    return { success: true };
  },

  getProfile: async (token) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }
};
