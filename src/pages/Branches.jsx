import { useState } from 'react';
import './Branches.css';

const REGIONS = ['All Regions', 'South Bangalore', 'North Bangalore', 'East Bangalore', 'West Bangalore'];
const STATUSES = ['All Status', 'Active', 'Inactive'];

const BRANCHES = [
  {
    id: 1, code: 'NF-BLR-01', name: 'Koramangala Branch',
    address: '47, 5th Block, Koramangala, Bangalore – 560095',
    region: 'South Bangalore', manager: 'Rajesh Sharma',
    phone: '+91 80 4567 8901', email: 'koramangala@nandifinance.in',
    opened: 'Jan 2018', status: 'Active',
    staff: 12, enquiries: 148, sanctioned: 102, rejected: 28, inProgress: 18,
  },
  {
    id: 2, code: 'NF-BLR-02', name: 'KP Road Branch',
    address: '12, Kanakapura Road, Jayanagar, Bangalore – 560070',
    region: 'South Bangalore', manager: 'Sunita Rao',
    phone: '+91 80 4567 8902', email: 'kproad@nandifinance.in',
    opened: 'Mar 2019', status: 'Active',
    staff: 9, enquiries: 112, sanctioned: 78, rejected: 22, inProgress: 12,
  },
  {
    id: 3, code: 'NF-BLR-03', name: 'KR Road Branch',
    address: '8, Krishnarajendra Road, Basavanagudi, Bangalore – 560004',
    region: 'South Bangalore', manager: 'Manoj Kumar',
    phone: '+91 80 4567 8903', email: 'krroad@nandifinance.in',
    opened: 'Jun 2019', status: 'Active',
    staff: 10, enquiries: 134, sanctioned: 91, rejected: 30, inProgress: 13,
  },
  {
    id: 4, code: 'NF-BLR-04', name: 'Bommanhalli Branch',
    address: '23, Bommanhalli Main Road, Bangalore – 560068',
    region: 'East Bangalore', manager: 'Vikram Joshi',
    phone: '+91 80 4567 8904', email: 'bommanhalli@nandifinance.in',
    opened: 'Sep 2020', status: 'Active',
    staff: 8, enquiries: 89, sanctioned: 58, rejected: 19, inProgress: 12,
  },
  {
    id: 5, code: 'NF-BLR-05', name: 'Jayanagar Branch',
    address: '34, 4th Block, Jayanagar, Bangalore – 560011',
    region: 'South Bangalore', manager: 'Anita Desai',
    phone: '+91 80 4567 8905', email: 'jayanagar@nandifinance.in',
    opened: 'Feb 2021', status: 'Active',
    staff: 7, enquiries: 76, sanctioned: 50, rejected: 16, inProgress: 10,
  },
  {
    id: 6, code: 'NF-BLR-06', name: 'Whitefield Branch',
    address: '15, ITPL Main Road, Whitefield, Bangalore – 560066',
    region: 'East Bangalore', manager: 'Rohit Agarwal',
    phone: '+91 80 4567 8906', email: 'whitefield@nandifinance.in',
    opened: 'Jul 2021', status: 'Active',
    staff: 11, enquiries: 121, sanctioned: 84, rejected: 24, inProgress: 13,
  },
  {
    id: 7, code: 'NF-BLR-07', name: 'Malleshwaram Branch',
    address: '9, 8th Cross, Malleshwaram, Bangalore – 560003',
    region: 'North Bangalore', manager: 'Suresh Kumar',
    phone: '+91 80 4567 8907', email: 'malleshwaram@nandifinance.in',
    opened: 'Nov 2021', status: 'Inactive',
    staff: 5, enquiries: 42, sanctioned: 28, rejected: 10, inProgress: 4,
  },
  {
    id: 8, code: 'NF-BLR-08', name: 'Hebbal Branch',
    address: '22, Hebbal Kempapura, Bangalore – 560024',
    region: 'North Bangalore', manager: 'Nisha Pillai',
    phone: '+91 80 4567 8908', email: 'hebbal@nandifinance.in',
    opened: 'Apr 2022', status: 'Active',
    staff: 8, enquiries: 95, sanctioned: 64, rejected: 20, inProgress: 11,
  },
];

function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

export default function BranchesPage() {
  const [query, setQuery]         = useState('');
  const [regionFilter, setRegion] = useState('All Regions');
  const [statusFilter, setStatus] = useState('All Status');
  const [view, setView]           = useState('grid'); // 'grid' | 'table'
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected]   = useState(null);

  const filtered = BRANCHES.filter(b => {
    const q = query.toLowerCase();
    const matchQ      = !q || b.name.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
    const matchRegion = regionFilter === 'All Regions' || b.region === regionFilter;
    const matchStatus = statusFilter === 'All Status'  || b.status === statusFilter;
    return matchQ && matchRegion && matchStatus;
  });

  const totalEnq  = BRANCHES.reduce((s, b) => s + b.enquiries, 0);
  const totalSanc = BRANCHES.reduce((s, b) => s + b.sanctioned, 0);
  const totalStaff = BRANCHES.reduce((s, b) => s + b.staff, 0);

  return (
    <div className="branches-page">
      <div className="branches-topbar">
        <div>
          <div className="branches-title">Branch Management</div>
          <div className="branches-sub">Manage all Nandi Finance branches across regions</div>
        </div>
        <button className="add-branch-btn" onClick={() => { setSelected(null); setShowModal(true); }}>+ Add Branch</button>
      </div>

      <div className="branches-body">
        {/* Summary strip */}
        <div className="branch-summary">
          <div className="bsum-card">
            <div className="bsum-val">{BRANCHES.length}</div>
            <div className="bsum-lbl">Total Branches</div>
          </div>
          <div className="bsum-card">
            <div className="bsum-val" style={{ color: 'var(--green)' }}>{BRANCHES.filter(b => b.status === 'Active').length}</div>
            <div className="bsum-lbl">Active</div>
          </div>
          <div className="bsum-card">
            <div className="bsum-val" style={{ color: 'var(--text-muted)' }}>{BRANCHES.filter(b => b.status === 'Inactive').length}</div>
            <div className="bsum-lbl">Inactive</div>
          </div>
          <div className="bsum-card">
            <div className="bsum-val">{totalStaff}</div>
            <div className="bsum-lbl">Total Staff</div>
          </div>
          <div className="bsum-card">
            <div className="bsum-val">{totalEnq}</div>
            <div className="bsum-lbl">Total Enquiries</div>
          </div>
          <div className="bsum-card">
            <div className="bsum-val" style={{ color: 'var(--green)' }}>{pct(totalSanc, totalEnq)}%</div>
            <div className="bsum-lbl">Avg Sanction Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="branch-filters">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search branch, manager or code..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
          </div>
          <select className="filter-select" value={regionFilter} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="view-toggle">
            <button className={`vt-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`vt-btn${view === 'table' ? ' active' : ''}`} onClick={() => setView('table')}>Table</button>
          </div>
          <div className="filter-count">{filtered.length} branches</div>
        </div>

        {/* Grid view */}
        {view === 'grid' && (
          <div className="branch-grid">
            {filtered.map(b => (
              <div key={b.id} className={`branch-card${b.status === 'Inactive' ? ' inactive' : ''}`}>
                <div className="bc-header">
                  <div>
                    <div className="bc-name">{b.name}</div>
                    <div className="bc-code">{b.code}</div>
                  </div>
                  <span className={`bc-status ${b.status === 'Active' ? 'bc-active' : 'bc-inactive'}`}>
                    <span className="dot" />{b.status}
                  </span>
                </div>
                <div className="bc-address">{b.address}</div>
                <div className="bc-meta">
                  <div className="bc-meta-row"><span className="bc-meta-lbl">Manager</span><span className="bc-meta-val">{b.manager}</span></div>
                  <div className="bc-meta-row"><span className="bc-meta-lbl">Region</span><span className="bc-meta-val">{b.region}</span></div>
                  <div className="bc-meta-row"><span className="bc-meta-lbl">Staff</span><span className="bc-meta-val">{b.staff} members</span></div>
                  <div className="bc-meta-row"><span className="bc-meta-lbl">Since</span><span className="bc-meta-val">{b.opened}</span></div>
                </div>
                <div className="bc-stats">
                  <div className="bc-stat"><div className="bc-stat-val">{b.enquiries}</div><div className="bc-stat-lbl">Enquiries</div></div>
                  <div className="bc-stat-div" />
                  <div className="bc-stat"><div className="bc-stat-val" style={{ color: 'var(--green)' }}>{b.sanctioned}</div><div className="bc-stat-lbl">Sanctioned</div></div>
                  <div className="bc-stat-div" />
                  <div className="bc-stat"><div className="bc-stat-val" style={{ color: 'var(--primary)' }}>{pct(b.sanctioned, b.enquiries)}%</div><div className="bc-stat-lbl">Rate</div></div>
                </div>
                <div className="bc-progress-track">
                  <div className="bc-progress-fill" style={{ width: pct(b.sanctioned, b.enquiries) + '%' }} />
                </div>
                <div className="bc-actions">
                  <button className="bc-btn bc-edit" onClick={() => { setSelected(b); setShowModal(true); }}>Edit</button>
                  <button className="bc-btn bc-view">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table view */}
        {view === 'table' && (
          <div className="branch-table-wrap">
            <table className="branch-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Region</th>
                  <th>Manager</th>
                  <th>Staff</th>
                  <th>Enquiries</th>
                  <th>Sanctioned</th>
                  <th>Rejected</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="bt-name">{b.name}</div>
                      <div className="bt-code">{b.code}</div>
                    </td>
                    <td><span className="region-chip">{b.region}</span></td>
                    <td><span className="manager-text">{b.manager}</span></td>
                    <td><strong>{b.staff}</strong></td>
                    <td><strong>{b.enquiries}</strong></td>
                    <td><span className="num-green">{b.sanctioned}</span></td>
                    <td><span className="num-red">{b.rejected}</span></td>
                    <td>
                      <span className={`rate-badge ${pct(b.sanctioned, b.enquiries) >= 70 ? 'rate-high' : 'rate-mid'}`}>
                        {pct(b.sanctioned, b.enquiries)}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot-badge ${b.status === 'Active' ? 'active' : 'inactive'}`}>
                        <span className="dot" />{b.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn act-edit" onClick={() => { setSelected(b); setShowModal(true); }}>Edit</button>
                        <button className={`act-btn ${b.status === 'Active' ? 'act-deactivate' : 'act-activate'}`}>
                          {b.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{selected ? 'Edit Branch' : 'Add New Branch'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-field"><label>Branch Name</label><input defaultValue={selected?.name || ''} placeholder="e.g. Indiranagar Branch" /></div>
                <div className="modal-field"><label>Branch Code</label><input defaultValue={selected?.code || ''} placeholder="NF-BLR-XX" /></div>
              </div>
              <div className="modal-field full"><label>Address</label><input defaultValue={selected?.address || ''} placeholder="Full branch address" /></div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Region</label>
                  <select defaultValue={selected?.region || ''}>
                    <option value="">Select region</option>
                    {REGIONS.slice(1).map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="modal-field"><label>Branch Manager</label><input defaultValue={selected?.manager || ''} placeholder="Manager name" /></div>
              </div>
              <div className="modal-row">
                <div className="modal-field"><label>Phone</label><input defaultValue={selected?.phone || ''} placeholder="+91 80 XXXX XXXX" /></div>
                <div className="modal-field"><label>Email</label><input defaultValue={selected?.email || ''} placeholder="branch@nandifinance.in" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={() => setShowModal(false)}>{selected ? 'Save Changes' : 'Create Branch'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
