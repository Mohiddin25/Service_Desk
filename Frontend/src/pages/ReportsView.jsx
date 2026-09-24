import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportsView = () => {
  const [period, setPeriod] = useState('month');

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with Period Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Reports</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Overview of support resolution performance and volume.</p>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'quarter', label: 'This Quarter' },
          ].map(p => (
            <button
              key={p.id}
              className={`chip ${period === p.id ? 'active' : ''}`}
              onClick={() => setPeriod(p.id)}
              style={{
                fontSize: '12.5px',
                padding: '5px 12px',
                background: period === p.id ? 'var(--blue)' : 'var(--bg)',
                color: period === p.id ? '#ffffff' : 'var(--text-2)',
                borderColor: period === p.id ? 'var(--blue)' : 'var(--border)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }} className="stats-row-4">
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Ticket Volume</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>1,248</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Avg Resolution Time</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>1.4 hrs</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>SLA Compliance</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success)' }}>96.2%</div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Customer CSAT</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue)' }}>4.9 / 5</div>
        </div>
      </div>

      {/* 2 Clean Consistent Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="reports-2col">
        {/* Chart 1: Tickets by Category */}
        <div className="card" style={{ padding: '18px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
            Tickets by Category
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Network & Wi-Fi</span>
                <span style={{ fontWeight: 600, color: 'var(--blue)' }}>420 (34%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '34%', height: '100%', background: 'var(--blue)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Software & Licensing</span>
                <span style={{ fontWeight: 600, color: 'var(--purple)' }}>380 (30%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'var(--purple)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Hardware & Monitors</span>
                <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>290 (23%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '23%', height: '100%', background: 'var(--text-2)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Account Access & Security</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>158 (13%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '13%', height: '100%', background: 'var(--success)', borderRadius: '99px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Resolution by Priority */}
        <div className="card" style={{ padding: '18px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
            Resolution Speed by Priority
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Critical (Target: 2h)</span>
                <span style={{ fontWeight: 600, color: 'var(--danger)' }}>1.1h avg</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'var(--danger)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>High (Target: 8h)</span>
                <span style={{ fontWeight: 600, color: 'var(--warning)' }}>4.2h avg</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: 'var(--warning)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Medium (Target: 24h)</span>
                <span style={{ fontWeight: 600, color: 'var(--blue)' }}>11.5h avg</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'var(--blue)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)' }}>Low (Target: 48h)</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>18.2h avg</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: 'var(--success)', borderRadius: '99px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
