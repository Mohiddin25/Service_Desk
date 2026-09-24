import React from 'react';
import { 
  Plus, Sparkles, BookOpen, Inbox, Clock, CheckCircle2, 
  AlertOctagon, ArrowRight, ShieldAlert, Cpu, Users, Wrench, 
  UserCheck, ShieldCheck, AlertTriangle, FileText, CheckSquare, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardView = ({ 
  tickets = [], 
  assets = [], 
  setActiveTab, 
  onOpenTicketModal, 
  onOpenAssetModal,
  onOpenUserModal,
  onSelectTicket 
}) => {
  const { user } = useAuth();
  // If user data is still loading, show a fallback UI
  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  const role = user.role || 'employee';

  /* -------------------------------------------------------------
     ROLE 1: EMPLOYEE DASHBOARD ("My Support Requests")
  ------------------------------------------------------------- */
  if (role === 'employee') {
    const myTickets = tickets.filter(t => 
      t.createdBy?.email === user.email || 
      t.createdBy?.name === user.name ||
      t.title?.toLowerCase().includes('wi-fi') ||
      t.title?.toLowerCase().includes('password')
    );
    const displayTickets = myTickets.length > 0 ? myTickets : tickets.slice(0, 3);
    const openCount = displayTickets.filter(t => t.status === 'open').length || 1;
    const inProgressCount = displayTickets.filter(t => t.status === 'in_progress' || t.status === 'assigned').length || 1;
    const resolvedCount = displayTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length || 4;

    const myAssets = assets.filter(a => a.assignedTo === user?.name || a.assignedTo === 'Mohiddin');

    return (
      <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              Welcome, {user?.name ?? 'User'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
              Your Support Overview — track submitted requests and assigned equipment.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenTicketModal}>
            <Plus size={16} />
            <span>+ Create Ticket</span>
          </button>
        </div>

        {/* 3 Metric Cards for Employee */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }} className="stats-row-4">
          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Open Tickets</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>{openCount}</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={18} />
            </div>
          </div>

          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>In Progress</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>{inProgressCount}</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>

          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Resolved</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>{resolvedCount}</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* 2-Column: Recent Tickets & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }} className="dashboard-grid-2col">
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>My Recent Tickets</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('my_tickets')}>
                <span>View all</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Issue</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTickets.map(t => (
                    <tr key={t._id} onClick={() => onSelectTicket(t)}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--blue)' }}>{t.ticketNumber}</td>
                      <td style={{ fontWeight: 500, color: 'var(--text)' }}>{t.title}</td>
                      <td><span className={`badge badge-${t.status}`}>{t.status.replace('_', ' ')}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onSelectTicket(t); }}>
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Assigned Equipment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Quick Actions</h2>
              <button className="btn btn-secondary" onClick={onOpenTicketModal} style={{ justifyContent: 'flex-start', fontSize: '13px' }}>
                <Plus size={15} color="var(--blue)" />
                <span>+ Create Ticket</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('ai_assistant')} style={{ justifyContent: 'flex-start', fontSize: '13px' }}>
                <Sparkles size={15} color="var(--purple)" />
                <span>Ask AI</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('kb')} style={{ justifyContent: 'flex-start', fontSize: '13px' }}>
                <BookOpen size={15} color="var(--text-2)" />
                <span>Browse Knowledge</span>
              </button>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>My Assigned Equipment</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <span>Laptop (AST-001)</span>
                  <span className="badge badge-resolved">Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>UltraSharp Monitor</span>
                  <span className="badge badge-open">Assigned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ROLE 2: TECHNICIAN WORKBENCH ("My Assigned Work")
  ------------------------------------------------------------- */
  if (role === 'technician') {
    const assignedTickets = tickets.filter(t => t.assignedTo?.name?.toLowerCase().includes('rahul') || t.status === 'assigned' || t.status === 'in_progress');
    const displayAssigned = assignedTickets.length > 0 ? assignedTickets : tickets.slice(0, 4);
    const criticalCount = displayAssigned.filter(t => t.priority === 'critical').length || 1;
    const slaAtRiskCount = displayAssigned.filter(t => t.isSlaBreached || t.priority === 'high').length || 2;

    return (
      <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              Technician Workbench
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
              My Assigned Work — resolve assigned incidents and update work logs.
            </p>
          </div>

          <button className="btn btn-secondary" onClick={() => setActiveTab('ai_assistant')}>
            <Sparkles size={16} color="var(--purple)" />
            <span>AI Troubleshooting</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }} className="stats-row-4">
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Assigned to Me</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>8</div>
          </div>
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>In Progress</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)' }}>4</div>
          </div>
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Critical</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)' }}>{criticalCount}</div>
          </div>
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>SLA At Risk</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)' }}>{slaAtRiskCount}</div>
          </div>
        </div>

        {/* Main Section: My Assigned Tickets */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>My Assigned Tickets</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('assigned_tickets')}>
              <span>View queue</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>SLA Status</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayAssigned.map((t, idx) => (
                  <tr key={t._id || idx} onClick={() => onSelectTicket(t)}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--blue)' }}>{t.ticketNumber}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text)' }}>{t.title}</td>
                    <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                    <td>
                      <span className={`badge ${idx === 0 ? 'badge-critical' : 'badge-resolved'}`}>
                        {idx === 0 ? 'At Risk' : 'On Track'}
                      </span>
                    </td>
                    <td><span className={`badge badge-${t.status}`}>{t.status.replace('_', ' ')}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onSelectTicket(t); }}>
                          Open
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setActiveTab('ai_assistant'); }}>
                          <Sparkles size={13} color="var(--purple)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ROLE 3: IT MANAGER DESK ("IT Operations Overview")
  ------------------------------------------------------------- */
  if (role === 'it_manager') {
    return (
      <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              IT Operations Overview
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
              Monitor team resolution velocity, active SLA thresholds, and escalations.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setActiveTab('reports')}>
            <BarChart3 size={16} />
            <span>Generate Executive Report</span>
          </button>
        </div>

        {/* 5 Operational Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }} className="stats-row-4">
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Open Tickets</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>24</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Critical</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--danger)' }}>3</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>SLA At Risk</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--warning)' }}>5</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>SLA Breached</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--danger)' }}>2</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Resolved Today</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>12</div>
          </div>
        </div>

        {/* Technician Workload & SLA Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }} className="dashboard-grid-2col">
          {/* Technician Workload Table */}
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Technician Workload
            </h2>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>Assigned</th>
                    <th>Active</th>
                    <th>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Rahul</td>
                    <td>8</td>
                    <td><span className="badge badge-warning">4</span></td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>12</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Arjun</td>
                    <td>6</td>
                    <td><span className="badge badge-warning">2</span></td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>9</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Priya</td>
                    <td>7</td>
                    <td><span className="badge badge-warning">3</span></td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SLA Distribution */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>SLA Compliance Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                  <span>On Track</span>
                  <strong style={{ color: 'var(--success)' }}>84%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '84%', height: '100%', background: 'var(--success)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                  <span>At Risk</span>
                  <strong style={{ color: 'var(--warning)' }}>11%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '11%', height: '100%', background: 'var(--warning)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                  <span>Breached</span>
                  <strong style={{ color: 'var(--danger)' }}>5%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '5%', height: '100%', background: 'var(--danger)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ROLE 4: ASSET MANAGER HUB ("Asset Operations")
  ------------------------------------------------------------- */
  if (role === 'asset_manager') {
    return (
      <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              Asset Operations Hub
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
              Hardware inventory, user device allocations, and scheduled vendor maintenance.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenAssetModal}>
            <Plus size={16} />
            <span>+ Register Asset</span>
          </button>
        </div>

        {/* 5 Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }} className="stats-row-4">
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Total Assets</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>250</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Available</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue)' }}>32</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Assigned</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>198</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Maintenance</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--warning)' }}>15</div>
          </div>
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Retired</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-3)' }}>5</div>
          </div>
        </div>

        {/* Asset Lifecycle Workflow */}
        <div className="card" style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
            Asset Lifecycle Flow
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '13px' }}>
            <span className="badge badge-open">1. Asset Ingestion</span>
            <span>→</span>
            <span className="badge badge-assigned">2. Allocation to Employee</span>
            <span>→</span>
            <span className="badge badge-assigned">3. Linked to Support Tickets</span>
            <span>→</span>
            <span className="badge badge-warning">4. Scheduled Maintenance</span>
            <span>→</span>
            <span className="badge badge-closed">5. Return / Retirement</span>
          </div>
        </div>

        {/* Recent Assets Table */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Inventory Status</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('assets')}>
              <span>View full inventory</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 5).map(a => (
                  <tr key={a._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--blue)' }}>{a.assetTag}</td>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td><span className="badge badge-assigned">{a.type}</span></td>
                    <td>{a.assignedTo}</td>
                    <td>
                      <span className={`badge ${a.status === 'Available' ? 'badge-open' : a.status === 'Assigned' ? 'badge-resolved' : 'badge-warning'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ROLE 5: SYSTEM ADMIN CONSOLE ("System Administration")
  ------------------------------------------------------------- */
  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
            System Administration Console
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
            Organizational user directory, system health, and global IT governance.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenUserModal}>
          <Users size={16} />
          <span>+ Add User</span>
        </button>
      </div>

      {/* 5 Admin Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }} className="stats-row-4">
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Total Staff Users</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue)' }}>48</div>
        </div>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Active Tickets</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{tickets.length}</div>
        </div>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>Total Assets</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{assets.length || 250}</div>
        </div>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>SLA Alerts</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--danger)' }}>2</div>
        </div>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginBottom: '4px' }}>System Health</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>100%</div>
        </div>
      </div>

      {/* User Directory Quick Control Panel */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Staff User Directory</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('users')}>
            <span>Manage All Users</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Mohiddin</td>
                <td style={{ color: 'var(--text-2)' }}>mohiddin@company.com</td>
                <td><span className="badge badge-open">Employee</span></td>
                <td>Operations</td>
                <td><span className="badge badge-resolved">Active</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Rahul</td>
                <td style={{ color: 'var(--text-2)' }}>rahul@company.com</td>
                <td><span className="badge badge-assigned">Technician</span></td>
                <td>IT Support</td>
                <td><span className="badge badge-resolved">Active</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Priya</td>
                <td style={{ color: 'var(--text-2)' }}>priya@company.com</td>
                <td><span className="badge badge-in_progress">IT Manager</span></td>
                <td>IT Infrastructure</td>
                <td><span className="badge badge-resolved">Active</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Sam Asset</td>
                <td style={{ color: 'var(--text-2)' }}>sam@company.com</td>
                <td><span className="badge badge-assigned">Asset Manager</span></td>
                <td>Asset Procurement</td>
                <td><span className="badge badge-resolved">Active</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Alex Admin</td>
                <td style={{ color: 'var(--text-2)' }}>alex@company.com</td>
                <td><span className="badge badge-critical">System Admin</span></td>
                <td>IT Administration</td>
                <td><span className="badge badge-resolved">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
