import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Check } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const NotificationsView = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.notifications.getAll();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.notifications.clearAll();
      addToast("Notifications cleared.", "info");
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="content-body" style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Notifications</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Stay informed about ticket updates and assignments.</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ color: 'var(--text-3)' }}>
            <Trash2 size={14} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
            <Bell size={32} color="var(--text-3)" style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '13.5px' }}>No notifications at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((n, idx) => (
              <div 
                key={n.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: idx !== notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  background: n.isRead ? 'var(--surface)' : 'var(--blue-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: n.isRead ? 'transparent' : 'var(--blue)',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />

                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: n.isRead ? 500 : 600, color: 'var(--text)' }}>
                      {n.title || n.message}
                    </div>
                    {n.title && n.message && (
                      <div style={{ fontSize: '12.5px', color: 'var(--text-2)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                    )}
                    <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '3px' }}>
                      {n.timestamp || 'Just now'}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    <Check size={13} />
                    <span>Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
