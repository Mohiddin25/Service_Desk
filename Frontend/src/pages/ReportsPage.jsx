import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const ReportsPage = () => {
  // Purposeful, compact charts and operational IT statistics
  const weeklyVolume = [
    { day: 'Mon', count: 18, resolved: 14 },
    { day: 'Tue', count: 24, resolved: 21 },
    { day: 'Wed', count: 29, resolved: 26 },
    { day: 'Thu', count: 22, resolved: 20 },
    { day: 'Fri', count: 16, resolved: 15 }
  ];

  const maxVolume = 30;

  const priorityBreakdown = [
    { label: 'Critical (P1)', count: 4, percentage: 8, color: 'var(--status-red-text)' },
    { label: 'High (P2)', count: 14, percentage: 26, color: '#8c5200' },
    { label: 'Medium (P3)', count: 24, percentage: 46, color: 'var(--primary)' },
    { label: 'Low (P4)', count: 10, percentage: 20, color: 'var(--text-muted)' }
  ];

  const resolutionTimes = [
    { category: 'Account Access', avgHours: '1.2h', targetHours: '2.0h', status: 'Compliant' },
    { category: 'Software Issue', avgHours: '3.4h', targetHours: '4.0h', status: 'Compliant' },
    { category: 'Network Connectivity', avgHours: '4.1h', targetHours: '4.0h', status: 'At Risk' },
    { category: 'Hardware Replacement', avgHours: '18.5h', targetHours: '24.0h', status: 'Compliant' }
  ];

  const assetDistribution = [
    { type: 'Laptops', total: 142, assigned: 128, available: 10, repair: 4 },
    { type: 'Monitors', total: 98, assigned: 82, available: 14, repair: 2 },
    { type: 'Network APs', total: 34, assigned: 30, available: 2, repair: 2 },
    { type: 'Mobile Devices', total: 22, assigned: 18, available: 3, repair: 1 }
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">Operational Reports</h1>
          <span className="metadata-text">Service performance, resolution times, SLA compliance, and capacity utilization</span>
        </div>
      </div>

      {/* Top 3 Summary Key Performance Indicators */}
      <div className="metrics-row" style={{ marginBottom: 20 }}>
        <div className="metric-card">
          <span className="metric-card-label">Mean Time to Resolve (MTTR)</span>
          <span className="metric-card-value">3.6h</span>
          <span className="metric-card-sub" style={{ color: 'var(--status-green-text)' }}>↓ 18% improvement MoM</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Overall SLA Compliance</span>
          <span className="metric-card-value" style={{ color: 'var(--status-green-text)' }}>96.4%</span>
          <span className="metric-card-sub">Target: &gt; 95.0%</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">First Contact Resolution</span>
          <span className="metric-card-value">68.2%</span>
          <span className="metric-card-sub">Tier-1 & Knowledge base</span>
        </div>
      </div>

      {/* Grid: 2 Compact Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20, marginBottom: 20 }}>
        {/* Ticket Volume (Weekly) */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Ticket Volume & Throughput</h2>
            <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: 2 }} /> Raised
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, background: 'var(--status-green-text)', borderRadius: 2 }} /> Resolved
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, padding: '10px 10px 0 10px', gap: 14 }}>
            {weeklyVolume.map((item, idx) => {
              const raisedHeight = (item.count / maxVolume) * 120;
              const resolvedHeight = (item.resolved / maxVolume) * 120;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
                    <div
                      title={`Raised: ${item.count}`}
                      style={{
                        width: 18,
                        height: `${raisedHeight}px`,
                        background: 'var(--primary)',
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                    <div
                      title={`Resolved: ${item.resolved}`}
                      style={{
                        width: 18,
                        height: `${resolvedHeight}px`,
                        background: 'var(--status-green-text)',
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Priority Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Priority Distribution</h2>
            <span className="metadata-text">Active incidents</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {priorityBreakdown.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{p.label}</span>
                  <span className="metadata-text">{p.count} tickets ({p.percentage}%)</span>
                </div>
                <div style={{ height: 6, background: '#ebecf0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${p.percentage}%`, height: '100%', background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Resolution Times & Asset Status Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Resolution Time by Category */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="section-title">Resolution Time by Category</h2>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Avg Resolution</th>
                <th>SLA Target</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resolutionTimes.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.category}</td>
                  <td>{r.avgHours}</td>
                  <td className="text-secondary">{r.targetHours}</td>
                  <td>
                    <Badge
                      type="sla"
                      value={r.status === 'Compliant' ? 'on_track' : 'at_risk'}
                      label={r.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Asset Inventory Status */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="section-title">Hardware Asset Utilization</h2>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Total</th>
                <th>Assigned</th>
                <th>Available</th>
                <th>Repair</th>
              </tr>
            </thead>
            <tbody>
              {assetDistribution.map((a, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{a.type}</td>
                  <td>{a.total}</td>
                  <td><span style={{ color: 'var(--primary)', fontWeight: 600 }}>{a.assigned}</span></td>
                  <td><span style={{ color: 'var(--status-green-text)', fontWeight: 600 }}>{a.available}</span></td>
                  <td><span style={{ color: a.repair > 0 ? 'var(--status-amber-text)' : 'var(--text-muted)' }}>{a.repair}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
