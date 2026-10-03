import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X, Ticket, AlertTriangle, CheckCircle2, Laptop } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import { Button } from '../ui/Button';

export const NotificationDrawer = ({ isOpen, onClose, onSelectTicket }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getAll();
      setNotifications(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    loadNotifications();
  };

  const handleClearAll = async () => {
    await notificationApi.clearAll();
    loadNotifications();
  };

  const handleItemClick = (n) => {
    if (n.ticketNumber && onSelectTicket) {
      onSelectTicket(n.ticketNumber);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(9, 30, 66, 0.35)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafbfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="var(--primary)" />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Notifications</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              className="icon-btn"
              onClick={handleMarkAllRead}
              title="Mark all as read"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleClearAll}
              title="Clear all"
            >
              <Trash2 size={15} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No notifications right now.
            </div>
          ) : (
            notifications.map((n) => {
              let Icon = Bell;
              let iconColor = 'var(--primary)';
              let iconBg = 'var(--primary-subtle)';

              if (n.type === 'assignment') {
                Icon = Ticket;
              } else if (n.type === 'sla_warning') {
                Icon = AlertTriangle;
                iconColor = 'var(--status-amber-text)';
                iconBg = 'var(--status-amber-bg)';
              } else if (n.type === 'resolved') {
                Icon = CheckCircle2;
                iconColor = 'var(--status-green-text)';
                iconBg = 'var(--status-green-bg)';
              } else if (n.type === 'asset') {
                Icon = Laptop;
              }

              return (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: n.read ? '#fff' : '#fafbfc',
                    cursor: n.ticketNumber ? 'pointer' : 'default',
                    transition: 'all 0.1s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                      {n.title}
                    </div>
                    <div className="metadata-text" style={{ marginTop: 2 }}>
                      {n.time}
                    </div>
                  </div>

                  {!n.read && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', position: 'absolute', top: 12, right: 12 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
