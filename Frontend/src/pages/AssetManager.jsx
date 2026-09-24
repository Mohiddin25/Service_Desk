import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Cpu, PlusCircle, Monitor, Server, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { AssetModal } from '../components/AssetModal';

export const AssetManager = ({ activeTab }) => {
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const data = await api.assets.getAll();
    setAssets(data);
  };

  const handleStatusChange = async (assetId, status) => {
    await api.assets.updateStatus(assetId, status);
    loadAssets();
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-body">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>IT Hardware & Asset Lifecycle Management</h1>
          <p>Track laptops, displays, servers, SaaS licenses, user assignments, and repair status.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={18} />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Asset KPI Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Cpu size={22} />
          </div>
          <div>
            <div className="stat-value">{assets.length}</div>
            <div className="stat-label">Total Registered Assets</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Monitor size={22} />
          </div>
          <div>
            <div className="stat-value">{assets.filter(a => a.status === 'ASSIGNED').length}</div>
            <div className="stat-label">Currently Assigned</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{assets.filter(a => a.status === 'UNDER_REPAIR').length}</div>
            <div className="stat-label">Under Repair / Maintenance</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '18px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="input" 
          placeholder="Search assets by tag, model name, or serial number..." 
          style={{ paddingLeft: '38px' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Assets Inventory Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Asset Tag</th>
              <th>Asset Model / Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Assigned To</th>
              <th>Lifecycle Status</th>
              <th>Status Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => (
              <tr key={asset._id}>
                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{asset.assetTag}</td>
                <td style={{ fontWeight: 600 }}>{asset.name}</td>
                <td><span className="badge badge-assigned">{asset.category}</span></td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{asset.serialNumber}</td>
                <td>{asset.assignedToUserId?.name || 'Unassigned'}</td>
                <td>
                  <span className={`badge ${
                    asset.status === 'ASSIGNED' ? 'badge-resolved' : 
                    asset.status === 'UNDER_REPAIR' ? 'badge-in_progress' : 
                    asset.status === 'AVAILABLE' ? 'badge-open' : 'badge-closed'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="select" 
                    style={{ fontSize: '0.75rem', padding: '3px 6px', width: '135px' }}
                    value={asset.status}
                    onChange={e => handleStatusChange(asset._id, e.target.value)}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="UNDER_REPAIR">UNDER REPAIR</option>
                    <option value="RETIRED">RETIRED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAssetCreated={loadAssets} 
      />
    </div>
  );
};
