import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { assetApi } from '../../api/assetApi';

export const AssetFormModal = ({ isOpen, onClose, onAssetCreated }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('laptop');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('in_inventory');
  const [assignedToName, setAssignedToName] = useState('');
  const [department, setDepartment] = useState('IT Operations');
  const [cost, setCost] = useState('');
  const [warrantyExpiration, setWarrantyExpiration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Asset name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await assetApi.create({
        name: name.trim(),
        category,
        modelNumber: modelNumber.trim(),
        serialNumber: serialNumber.trim(),
        status,
        assignedToName: assignedToName.trim() || undefined,
        department,
        cost: cost ? parseFloat(cost) : 0,
        warrantyExpiration: warrantyExpiration || undefined,
        notes: notes.trim()
      });

      if (onAssetCreated) onAssetCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Asset"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create Asset
          </Button>
        </>
      }
    >
      {error && (
        <div style={{ padding: '8px 12px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Asset Name"
          required
          placeholder="e.g. MacBook Pro 16 M3 Max, Dell 32 Monitor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="form-row">
          <Select
            label="Type / Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'laptop', label: 'Laptop' },
              { value: 'desktop', label: 'Desktop' },
              { value: 'peripheral', label: 'Monitor / Peripheral' },
              { value: 'network', label: 'Network Equipment' },
              { value: 'mobile', label: 'Mobile Device' },
              { value: 'software', label: 'Software License' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'in_inventory', label: 'Available (In Inventory)' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'under_repair', label: 'Maintenance' },
              { value: 'retired', label: 'Retired' }
            ]}
          />
        </div>

        <div className="form-row">
          <Input
            label="Model Number"
            placeholder="e.g. A2991, U3223QE"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
          />

          <Input
            label="Serial Number"
            placeholder="e.g. C02G879XMD6R"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>

        <div className="form-row">
          <Input
            label="Assigned To (User Name)"
            placeholder="e.g. Sarah Jenkins (Optional)"
            value={assignedToName}
            onChange={(e) => setAssignedToName(e.target.value)}
          />

          <Input
            label="Warranty Expiration"
            type="date"
            value={warrantyExpiration}
            onChange={(e) => setWarrantyExpiration(e.target.value)}
          />
        </div>

        <Textarea
          label="Notes / Specs"
          rows={3}
          placeholder="RAM, storage, dock accessories, purchase invoice number..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
