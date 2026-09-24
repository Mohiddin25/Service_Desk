import React, { useState, useEffect } from 'react';
import { TicketCard } from '../components/TicketCard';
import { api } from '../api/client';
import { PlusCircle, Search, Monitor, ShieldCheck, HelpCircle, BookOpen, Sparkles, Laptop, Wifi, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmployeePortal = ({ activeTab, onOpenTicketModal, onSelectTicket }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  const loadData = async () => {
    const tData = await api.tickets.getAll({ search: searchTerm, status: statusFilter });
    setTickets(tData);
    const aData = await api.assets.getAll();
    setAssets(aData);
  };

  return (
    <div className="page-body">
      {/* Employee Top Hero Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Welcome back, {user?.name.split(' ')[0] || 'Employee'}</h1>
          <p>Submit IT support requests, track resolution progress, and manage assigned hardware assets.</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenTicketModal}>
          <PlusCircle size={18} />
          <span>New Support Request</span>
        </button>
      </div>

      {activeTab === 'tickets' && (
        <div>
          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search tickets by title, description, or ticket number..." 
                style={{ paddingLeft: '38px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="select" style={{ width: '180px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Ticket Cards Grid */}
          {tickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p>No support tickets found matching your search criteria.</p>
              <button className="btn btn-primary" style={{ marginTop: '14px' }} onClick={onOpenTicketModal}>
                <PlusCircle size={16} />
                <span>Submit Ticket Now</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {tickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'assets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>My Assigned IT Assets</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing hardware registered to your user profile</span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Device / Software Name</th>
                  <th>Category</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>Warranty Expiration</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{asset.assetTag}</td>
                    <td style={{ fontWeight: 600 }}>{asset.name}</td>
                    <td><span className="badge badge-assigned">{asset.category}</span></td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{asset.serialNumber}</td>
                    <td>
                      <span className={`badge ${asset.status === 'ASSIGNED' ? 'badge-resolved' : 'badge-in_progress'}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td>{asset.warrantyExpiration || '2027-01-15'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'kb' && (
        <div>
          <h2 style={{ marginBottom: '16px' }}>Self-Service Knowledge Base</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
                <Wifi size={20} />
                <h3 style={{ fontSize: '1rem' }}>Corporate VPN Setup Guide</h3>
              </div>
              <p style={{ fontSize: '0.85rem' }}>Step-by-step instructions for macOS Sequoia and Windows 11 Cisco AnyConnect VPN client configuration.</p>
            </div>
            
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontSize: '1rem' }}>Password Reset & Okta 2FA</h3>
              </div>
              <p style={{ fontSize: '0.85rem' }}>How to reset expired Active Directory passwords self-service using Okta Verify multi-factor auth.</p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
                <Laptop size={20} />
                <h3 style={{ fontSize: '1rem' }}>External Monitor Display Setup</h3>
              </div>
              <p style={{ fontSize: '0.85rem' }}>Troubleshooting 4K display flicker and updating USB-C dock firmware drivers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
