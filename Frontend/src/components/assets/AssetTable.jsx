import React from 'react';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';

export const AssetTable = ({ assets = [], onSelectAsset, onEditAsset, emptyMessage = 'No assets found' }) => {
  const columns = [
    {
      header: 'Asset ID',
      key: 'assetTag',
      width: '120px',
      render: (a) => <span className="table-key">{a.assetTag}</span>
    },
    {
      header: 'Asset',
      key: 'name',
      render: (a) => (
        <div>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</span>
          {a.modelNumber && (
            <span className="metadata-text" style={{ display: 'block', marginTop: 1 }}>
              Model: {a.modelNumber}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Type',
      key: 'category',
      width: '110px',
      render: (a) => (
        <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
          {a.category}
        </span>
      )
    },
    {
      header: 'Assigned To',
      key: 'assignedTo',
      width: '150px',
      render: (a) => (
        <span style={{ color: a.assignedTo ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {a.assignedTo ? (a.assignedTo.name || a.assignedTo) : 'Unassigned'}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      width: '120px',
      render: (a) => <Badge type="status" value={a.status} />
    },
    {
      header: 'Warranty',
      key: 'warrantyExpiration',
      width: '120px',
      render: (a) => (
        <span className="metadata-text">
          {a.warrantyExpiration ? new Date(a.warrantyExpiration).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '90px',
      align: 'right',
      render: (a) => (
        <Button
          variant="subtle"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectAsset) onSelectAsset(a);
          }}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={assets}
      onRowClick={onSelectAsset}
      emptyMessage={emptyMessage}
    />
  );
};
