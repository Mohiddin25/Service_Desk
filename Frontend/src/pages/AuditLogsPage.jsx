import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, FileCheck } from 'lucide-react';

export const AuditLogsPage = () => {
  const [search, setSearch] = useState('');

  const logs = [
    { id: 'log-1', timestamp: '2026-10-02 09:44:12', user: 'Alex Admin', action: 'USER_CREATED', target: 'Sarah Jenkins (sarah@company.com)', ip: '10.0.4.12' },
    { id: 'log-2', timestamp: '2026-10-02 08:30:05', user: 'Dave Tech', action: 'TICKET_STATUS_UPDATED', target: 'INC-1024 -> in_progress', ip: '10.0.4.88' },
    { id: 'log-3', timestamp: '2026-10-02 08:15:22', user: 'Dave Tech', action: 'WORK_LOG_ADDED', target: 'INC-1024 (AP channel diagnostic)', ip: '10.0.4.88' },
    { id: 'log-4', timestamp: '2026-10-01 17:10:44', user: 'Marcus Asset', action: 'ASSET_STATUS_UPDATED', target: 'AST-004 -> under_repair', ip: '10.0.3.15' },
    { id: 'log-5', timestamp: '2026-10-01 15:02:11', user: 'Priya Manager', action: 'TICKET_ASSIGNED', target: 'INC-1023 assigned to Dave Tech', ip: '10.0.1.20' },
    { id: 'log-6', timestamp: '2026-10-01 11:22:30', user: 'Mohiddin Employee', action: 'TICKET_CREATED', target: 'INC-1023 (MacBook Air Flickering)', ip: '10.0.5.42' },
    { id: 'log-7', timestamp: '2026-09-30 16:45:00', user: 'Alex Admin', action: 'KB_ARTICLE_ADDED', target: 'FAQ-006 (Phishing reporting)', ip: '10.0.4.12' }
  ];

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">Audit Logs</h1>
          <span className="metadata-text">Immutable compliance activity trail and system authentication logs</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search audit trail by actor, action..."
              className="form-control"
              style={{ paddingLeft: 30, height: 32, fontSize: 13 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="metadata-text">
            {filtered.length} audit entries
          </span>
        </div>

        <table className="dense-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity / Description</th>
              <th>Client IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.timestamp}</td>
                <td style={{ fontWeight: 500 }}>{log.user}</td>
                <td>
                  <span style={{ fontSize: 11.5, fontFamily: 'monospace', padding: '2px 6px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    {log.action}
                  </span>
                </td>
                <td>{log.target}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
