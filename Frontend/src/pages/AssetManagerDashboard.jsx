import React, { useState } from 'react';
import { AssetTable } from '../components/assets/AssetTable';
import { AssetFormModal } from '../components/assets/AssetFormModal';
import { AssetDetailModal } from '../components/assets/AssetDetailModal';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Plus, Search } from 'lucide-react';

export const AssetManagerDashboard = ({ assets = [], onUpdate }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const totalAssets = assets.length;
  const available = assets.filter(a => a.status === 'in_inventory').length;
  const assigned = assets.filter(a => a.status === 'assigned').length;
  const maintenance = assets.filter(a => a.status === 'under_repair').length;
  const retired = assets.filter(a => a.status === 'retired').length;

  let filtered = [...assets];
  if (filterStatus !== 'all') {
    filtered = filtered.filter(a => a.status === filterStatus);
  }
  if (filterCategory !== 'all') {
    filtered = filtered.filter(a => a.category === filterCategory);
  }
  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(a =>
      a.assetTag.toLowerCase().includes(s) ||
      a.name.toLowerCase().includes(s) ||
      (a.assignedTo && (a.assignedTo.name || a.assignedTo).toLowerCase().includes(s))
    );
  }

  return (
    <div className="view-container">
      {/* Title */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">IT Asset Management</h1>
          <span className="metadata-text">Hardware inventory lifecycle, assignments, and warranty tracking</span>
        </div>
        <div className="view-header-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddOpen(true)}
          >
            Add Asset
          </Button>
        </div>
      </div>

      {/* Metrics: Total Assets, Available, Assigned, Maintenance, Retired */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-card-label">Total Assets</span>
          <span className="metric-card-value" style={{ color: 'var(--text-primary)' }}>{totalAssets}</span>
          <span className="metric-card-sub">Tracked inventory</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Available</span>
          <span className="metric-card-value" style={{ color: 'var(--status-green-text)' }}>{available}</span>
          <span className="metric-card-sub">In stock pool</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Assigned</span>
          <span className="metric-card-value" style={{ color: 'var(--primary)' }}>{assigned}</span>
          <span className="metric-card-sub">In active staff use</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Maintenance</span>
          <span className="metric-card-value" style={{ color: 'var(--status-amber-text)' }}>{maintenance}</span>
          <span className="metric-card-sub">Under repair / RMA</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Retired</span>
          <span className="metric-card-value" style={{ color: 'var(--text-muted)' }}>{retired}</span>
          <span className="metric-card-sub">Decommissioned</span>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">Hardware & Software Assets</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 8, top: 9, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search assets..."
                className="form-control"
                style={{ paddingLeft: 28, height: 30, fontSize: 13 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: 130, height: 30, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'in_inventory', label: 'Available' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'under_repair', label: 'Maintenance' },
                { value: 'retired', label: 'Retired' }
              ]}
            />

            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: 130, height: 30, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'laptop', label: 'Laptops' },
                { value: 'peripheral', label: 'Monitors / Periph' },
                { value: 'network', label: 'Network' },
                { value: 'mobile', label: 'Mobile' }
              ]}
            />
          </div>
        </div>

        <AssetTable
          assets={filtered}
          onSelectAsset={setSelectedAsset}
        />
      </div>

      <AssetFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAssetCreated={onUpdate}
      />

      <AssetDetailModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onUpdate={onUpdate}
        canManage={true}
      />
    </div>
  );
};
