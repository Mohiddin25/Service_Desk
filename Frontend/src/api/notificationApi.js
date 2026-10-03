// Centralized Notification API Service

let mockNotifications = [
  {
    id: 'notif-1',
    title: 'Ticket INC-1024 assigned to you',
    time: '12 mins ago',
    type: 'assignment',
    ticketNumber: 'INC-1024',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Ticket INC-1021 approaching SLA',
    time: '25 mins ago',
    type: 'sla_warning',
    ticketNumber: 'INC-1021',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Ticket INC-1018 resolved',
    time: '2 hours ago',
    type: 'resolved',
    ticketNumber: 'INC-1018',
    read: true
  },
  {
    id: 'notif-4',
    title: 'New asset AST-002 added to inventory',
    time: '1 day ago',
    type: 'asset',
    read: true
  }
];

export const notificationApi = {
  getAll: async () => {
    return [...mockNotifications];
  },

  markAsRead: async (id) => {
    mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    return { success: true };
  },

  markAllAsRead: async () => {
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
    return { success: true };
  },

  clearAll: async () => {
    mockNotifications = [];
    return { success: true };
  }
};
