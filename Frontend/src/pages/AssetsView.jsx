import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { api } from '../api/client';

export const AssetsView = ({ onOpenAssetModal }) => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await api.assets.getAll();
      setAssets(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const assetTypes = ['All', 'Laptop', 'Desktop', 'Monitor', 'Printer', 'Network Device', 'Software License'];

  const filteredAssets = assets.filter(a => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = 
      (a.name && a.name.toLowerCase().includes(s)) ||
      (a.assetTag && a.assetTag.toLowerCase().includes(s)) ||
      (a.assignedTo && a.assignedTo.toLowerCase().includes(s));
    const matchesType = typeFilter === 'All' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Assets</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Manage corporate hardware, monitors, devices, and software licenses.</p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAssetModal}>
          <Plus size={16} />
          <span>+ Add Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px 14px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search assets..." 
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="select" 
          style={{ width: '160px', height: '34px', fontSize: '13px' }}
          value={typeFilter} 
          onChange={e => setTypeFilter(e.target.value)}
        >
          {assetTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Assets Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Asset ID</th>
                <th>Name</th>
                <th style={{ width: '130px' }}>Type</th>
                <th style={{ width: '160px' }}>Assigned To</th>
                <th style={{ width: '120px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                    No assets recorded.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--blue)' }}>
                      {a.assetTag}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text)' }}>
                      {a.name}
                    </td>
                    <td>
                      <span className="badge badge-assigned">{a.type}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                      {a.assignedTo || 'Unassigned'}
                    </td>
                    <td>
                      <span className={`badge ${
                        a.status === 'In Use' || a.status === 'Assigned' || a.status === 'Active' ? 'badge-resolved' :
                        a.status === 'Available' ? 'badge-open' : 'badge-in_progress'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
