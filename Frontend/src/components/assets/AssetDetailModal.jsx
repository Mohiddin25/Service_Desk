import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';
import { Laptop, Calendar, ShieldCheck, Ticket, User, History } from 'lucide-react';
import { assetApi } from '../../api/assetApi';

export const AssetDetailModal = ({ asset, isOpen, onClose, onUpdate, canManage = false }) => {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(asset?.status || 'in_inventory');

  if (!asset) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await assetApi.updateStatus(asset._id, newStatus);
      setCurrentStatus(newStatus);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${asset.assetTag} · ${asset.name}`}
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          {canManage ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="metadata-text">Lifecycle Status:</span>
              <Select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                style={{ width: 140, height: 30 }}
                options={[
                  { value: 'in_inventory', label: 'Available' },
                  { value: 'assigned', label: 'Assigned' },
                  { value: 'under_repair', label: 'Maintenance' },
                  { value: 'retired', label: 'Retired' }
                ]}
              />
            </div>
          ) : <div />}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Top Info Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Laptop size={22} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                {asset.name}
              </div>
              <div className="metadata-text">
                Category: <strong style={{ textTransform: 'capitalize' }}>{asset.category}</strong> · Serial: <strong>{asset.serialNumber || 'N/A'}</strong>
              </div>
            </div>
          </div>
          <Badge type="status" value={currentStatus} />
        </div>

        {/* 2-Column Specs: Information & Assignment */}
        <div className="form-row">
          <div className="card" style={{ padding: 14 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Hardware Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Model Number</span>
                <span style={{ fontWeight: 500 }}>{asset.modelNumber || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Purchase Date</span>
                <span>{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Acquisition Cost</span>
                <span>${asset.cost || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Department</span>
                <span>{asset.department?.name || 'General Operations'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Assignment & Warranty
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Currently Assigned</span>
                <strong style={{ color: asset.assignedTo ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {asset.assignedTo ? (asset.assignedTo.name || asset.assignedTo) : 'Unassigned (In Pool)'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Warranty Status</span>
                <span style={{ color: 'var(--status-green-text)', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Warranty Expiration</span>
                <span>{asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Asset Tag</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{asset.assetTag}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tickets */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ticket size={16} color="var(--primary)" />
            Related Support Tickets
          </h3>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="table-key">INC-1023</span>
                <span>Display Flickering when connecting to external 4K dock</span>
              </div>
              <Badge type="status" value="assigned" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="table-key">INC-0988</span>
                <span>Initial system image deployment and provisioning</span>
              </div>
              <Badge type="status" value="resolved" />
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <History size={16} color="var(--text-secondary)" />
            Lifecycle Audit History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#fafbfc', borderRadius: 'var(--radius-sm)' }}>
              <span>Assigned to current user</span>
              <span>2 months ago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#fafbfc', borderRadius: 'var(--radius-sm)' }}>
              <span>Warranty registered with manufacturer</span>
              <span>{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '6 months ago'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#fafbfc', borderRadius: 'var(--radius-sm)' }}>
              <span>Asset created and tagged in inventory</span>
              <span>{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '6 months ago'}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
