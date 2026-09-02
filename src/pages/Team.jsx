import { useState } from 'react';
import './Team.css';

const TEAM = [
  { id: 1, name: 'Priya Sharma',  role: 'Finance Executive', lead: 'Karan Singh',  branch: 'Koramangala', joined: 'Jan 2023', total: 18, sanctioned: 12, rejected: 3, pending: 3 },
  { id: 2, name: 'Rahul Mehta',   role: 'Finance Executive', lead: 'Karan Singh',  branch: 'KP Road',     joined: 'Mar 2023', total: 15, sanctioned: 9,  rejected: 4, pending: 2 },
  { id: 3, name: 'Sneha Patil',   role: 'Finance Executive', lead: 'Vikram Joshi', branch: 'KR Road',     joined: 'Jun 2022', total: 22, sanctioned: 16, rejected: 4, pending: 2 },
  { id: 4, name: 'Amit Verma',    role: 'Finance Executive', lead: 'Vikram Joshi', branch: 'Bommanhalli', joined: 'Sep 2022', total: 11, sanctioned: 6,  rejected: 3, pending: 2 },
  { id: 5, name: 'Deepika Nair',  role: 'Finance Executive', lead: 'Karan Singh',  branch: 'Koramangala', joined: 'Feb 2024', total: 9,  sanctioned: 5,  rejected: 2, pending: 2 },
  { id: 6, name: 'Karan Singh',   role: 'Finance Team Lead', lead: 'Karan Singh',  branch: 'KP Road',     joined: 'Aug 2021', total: 27, sanctioned: 20, rejected: 5, pending: 2 },
  { id: 7, name: 'Meera Iyer',    role: 'Finance Executive', lead: 'Vikram Joshi', branch: 'KR Road',     joined: 'Nov 2023', total: 8,  sanctioned: 4,  rejected: 2, pending: 2 },
  { id: 8, name: 'Vikram Joshi',  role: 'Finance Team Lead', lead: 'Vikram Joshi', branch: 'Bommanhalli', joined: 'May 2021', total: 31, sanctioned: 23, rejected: 5, pending: 3 },
];

const LEADS = [...new Set(TEAM.filter(m => m.role === 'Finance Team Lead').map(m => m.name))];

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }
function pct(val, total) { return total ? Math.round((val / total) * 100) : 0; }

const AVATAR_COLORS = [
  '#1a3a6b','#2a5298','#1a7a4a','#b07d1a',
  '#6b3a8a','#2a7a8a','#8a3a3a','#3a6b3a',
];

export default function TeamPage() {
  const [sort, setSort] = useState('total');
  const [selectedLead, setSelectedLead] = useState('All');

  const visibleTeam = selectedLead === 'All' ? TEAM : TEAM.filter(m => m.lead === selectedLead);

  const TOTAL_ENQ  = visibleTeam.reduce((s, m) => s + m.total, 0);
  const TOTAL_SANC = visibleTeam.reduce((s, m) => s + m.sanctioned, 0);
  const TOTAL_REJ  = visibleTeam.reduce((s, m) => s + m.rejected, 0);
  const TOTAL_PEND = visibleTeam.reduce((s, m) => s + m.pending, 0);
  const MAX_TOTAL  = visibleTeam.length ? Math.max(...visibleTeam.map(m => m.total)) : 1;

  const sorted = [...visibleTeam].sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="team-page">
      {/* Top bar */}
      <div className="team-topbar">
        <div>
          <div className="team-page-title">Team Breakdown</div>
          <div className="team-page-sub">
            {selectedLead === 'All'
              ? `Performance analytics for Ayush Tyagi's team · ${TEAM.length} members`
              : `Showing ${selectedLead}'s team · ${visibleTeam.length} members`}
          </div>
        </div>
        <div className="lead-filter">
          <span className="lead-filter-label">Team Lead</span>
          <div className="lead-seg">
            {['All', ...LEADS].map(l => (
              <button
                key={l}
                className={`lead-seg-btn${selectedLead === l ? ' active' : ''}`}
                onClick={() => setSelectedLead(l)}
              >
                {l === 'All' ? 'All Teams' : l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="team-body">

        {/* Summary KPI strip */}
        <div className="team-kpi-row">
          <div className="team-kpi">
            <div className="team-kpi-val">{TOTAL_ENQ}</div>
            <div className="team-kpi-lbl">Total Enquiries</div>
            <div className="team-kpi-bar" style={{ '--w': '100%', '--c': 'var(--primary)' }} />
          </div>
          <div className="team-kpi">
            <div className="team-kpi-val" style={{ color: 'var(--green)' }}>{TOTAL_SANC}</div>
            <div className="team-kpi-lbl">Sanctioned</div>
            <div className="team-kpi-bar" style={{ '--w': pct(TOTAL_SANC, TOTAL_ENQ) + '%', '--c': 'var(--green)' }} />
          </div>
          <div className="team-kpi">
            <div className="team-kpi-val" style={{ color: 'var(--red)' }}>{TOTAL_REJ}</div>
            <div className="team-kpi-lbl">Rejected</div>
            <div className="team-kpi-bar" style={{ '--w': pct(TOTAL_REJ, TOTAL_ENQ) + '%', '--c': 'var(--red)' }} />
          </div>
          <div className="team-kpi">
            <div className="team-kpi-val" style={{ color: 'var(--amber)' }}>{TOTAL_PEND}</div>
            <div className="team-kpi-lbl">Pending</div>
            <div className="team-kpi-bar" style={{ '--w': pct(TOTAL_PEND, TOTAL_ENQ) + '%', '--c': 'var(--amber)' }} />
          </div>
          <div className="team-kpi">
            <div className="team-kpi-val">{pct(TOTAL_SANC, TOTAL_ENQ)}%</div>
            <div className="team-kpi-lbl">Sanction Rate</div>
            <div className="team-kpi-bar" style={{ '--w': pct(TOTAL_SANC, TOTAL_ENQ) + '%', '--c': 'var(--primary)' }} />
          </div>
        </div>

        {/* Bar chart + member cards */}
        <div className="team-main-grid">

          {/* Bar chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Enquiries per Member</div>
                <div className="chart-sub">Sanctioned vs Rejected vs Pending</div>
              </div>
              <div className="chart-legend">
                <span className="legend-dot" style={{ background: 'var(--green)' }} />Sanctioned
                <span className="legend-dot" style={{ background: 'var(--red)' }} />Rejected
                <span className="legend-dot" style={{ background: 'var(--amber)' }} />Pending
              </div>
            </div>
            <div className="bar-chart">
              {visibleTeam.map((m, i) => (
                <div key={m.id} className="bar-row">
                  <div className="bar-name">{m.name.split(' ')[0]}</div>
                  <div className="bar-track">
                    <div className="bar-segment bar-sanc" style={{ width: pct(m.sanctioned, MAX_TOTAL) + '%' }} title={`Sanctioned: ${m.sanctioned}`} />
                    <div className="bar-segment bar-rej"  style={{ width: pct(m.rejected,   MAX_TOTAL) + '%' }} title={`Rejected: ${m.rejected}`} />
                    <div className="bar-segment bar-pend" style={{ width: pct(m.pending,    MAX_TOTAL) + '%' }} title={`Pending: ${m.pending}`} />
                  </div>
                  <div className="bar-total">{m.total}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut-style breakdown */}
          <div className="chart-card donut-card">
            <div className="chart-title">Team Sanction Rate</div>
            <div className="chart-sub">Overall conversion breakdown</div>
            <div className="donut-wrap">
              <svg viewBox="0 0 120 120" className="donut-svg">
                <DonutSegments sanctioned={TOTAL_SANC} rejected={TOTAL_REJ} pending={TOTAL_PEND} />
              </svg>
              <div className="donut-center">
                <div className="donut-pct">{pct(TOTAL_SANC, TOTAL_ENQ)}%</div>
                <div className="donut-lbl">Sanctioned</div>
              </div>
            </div>
            <div className="donut-legend">
              <div className="dl-row"><span className="dl-dot" style={{ background: 'var(--green)' }} /><span>Sanctioned</span><strong>{TOTAL_SANC}</strong></div>
              <div className="dl-row"><span className="dl-dot" style={{ background: 'var(--red)' }} /><span>Rejected</span><strong>{TOTAL_REJ}</strong></div>
              <div className="dl-row"><span className="dl-dot" style={{ background: 'var(--amber)' }} /><span>Pending</span><strong>{TOTAL_PEND}</strong></div>
            </div>
          </div>
        </div>

        {/* Member table */}
        <div className="member-table-card">
          <div className="member-table-header">
            <div>
              <div className="chart-title">Member Performance</div>
              <div className="chart-sub">Individual breakdown with conversion rates</div>
            </div>
            <div className="sort-row">
              <span className="sort-label">Sort by</span>
              {['total','sanctioned','rejected','pending'].map(s => (
                <button key={s} className={`sort-btn${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <table className="member-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Total</th>
                <th>Sanctioned</th>
                <th>Rejected</th>
                <th>Pending</th>
                <th>Rate</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
                <tr key={m.id}>
                  <td>
                    <div className="member-cell">
                      <div className="member-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {initials(m.name)}
                      </div>
                      <div>
                        <div className="member-name">{m.name}</div>
                        <div className="member-joined">Since {m.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-chip">{m.role}</span></td>
                  <td><strong>{m.total}</strong></td>
                  <td><span className="num-green">{m.sanctioned}</span></td>
                  <td><span className="num-red">{m.rejected}</span></td>
                  <td><span className="num-amber">{m.pending}</span></td>
                  <td>
                    <span className={`rate-badge ${pct(m.sanctioned, m.total) >= 70 ? 'rate-high' : pct(m.sanctioned, m.total) >= 50 ? 'rate-mid' : 'rate-low'}`}>
                      {pct(m.sanctioned, m.total)}%
                    </span>
                  </td>
                  <td>
                    <div className="progress-track">
                      <div className="progress-sanc" style={{ width: pct(m.sanctioned, m.total) + '%' }} />
                      <div className="progress-rej"  style={{ width: pct(m.rejected,   m.total) + '%' }} />
                      <div className="progress-pend" style={{ width: pct(m.pending,    m.total) + '%' }} />
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

/* Pure SVG donut — no library */
function DonutSegments({ sanctioned, rejected, pending }) {
  const total = sanctioned + rejected + pending;
  const r = 46; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;

  const segments = [
    { val: sanctioned, color: '#1a7a4a' },
    { val: rejected,   color: '#b03a2e' },
    { val: pending,    color: '#b07d1a' },
  ];

  let offset = 0;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f4f8" strokeWidth="16" />
      {segments.map((s, i) => {
        const dash = (s.val / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          />
        );
        offset += dash;
        return el;
      })}
    </>
  );
}
