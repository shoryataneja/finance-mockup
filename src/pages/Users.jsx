import { useState } from 'react';
import './Users.css';

const ROLES = ['Insurance Executive', 'Finance Executive', 'Team Leader'];
const BRANCHES = ['All Branches', 'Hosur Road', 'Hosur Road Rural Anekal', 'Hosur Road Rural Attibele', 'Hosur Road Rural Sarjapura', 'B G Road', 'White Field', 'K P Road', 'K P Road Rural Kanakapura', 'K P Road Rural Ramanagara', 'Queens Road', 'Queens Road Rural', 'Banaswadi'];
const STATUSES = ['All Status', 'Active', 'Inactive'];

const USERS = [
  { id: 1,  name: 'Shylaja',          email: 'shylaja@nandifinance.in',          phone: '+91 98001 00001', role: 'Team Leader',         branch: 'Hosur Road',                  joined: '01 Jan 2020', status: 'Active', lastLogin: '04 Sep, 9:10 AM' },
  { id: 2,  name: 'Sandeep',          email: 'sandeep@nandifinance.in',          phone: '+91 98001 00002', role: 'Insurance Executive', branch: 'Hosur Road',                  joined: '10 Jan 2021', status: 'Active', lastLogin: '04 Sep, 8:45 AM' },
  { id: 3,  name: 'Vijay',            email: 'vijay@nandifinance.in',            phone: '+91 98001 00003', role: 'Insurance Executive', branch: 'Hosur Road',                  joined: '15 Feb 2021', status: 'Active', lastLogin: '04 Sep, 9:00 AM' },
  { id: 4,  name: 'Bhaskar',          email: 'bhaskar@nandifinance.in',          phone: '+91 98001 00004', role: 'Insurance Executive', branch: 'Hosur Road',                  joined: '20 Mar 2021', status: 'Active', lastLogin: '03 Sep, 6:30 PM' },
  { id: 5,  name: 'Hirelinga',        email: 'hirelinga@nandifinance.in',        phone: '+91 98001 00005', role: 'Insurance Executive', branch: 'Hosur Road',                  joined: '05 Apr 2021', status: 'Active', lastLogin: '04 Sep, 10:15 AM' },
  { id: 6,  name: 'Hemalatha',        email: 'hemalatha@nandifinance.in',        phone: '+91 98001 00006', role: 'Insurance Executive', branch: 'Hosur Road',                  joined: '10 May 2021', status: 'Active', lastLogin: '04 Sep, 8:55 AM' },
  { id: 7,  name: 'Sunil',            email: 'sunil@nandifinance.in',            phone: '+91 98001 00007', role: 'Insurance Executive', branch: 'K P Road',                    joined: '01 Jun 2021', status: 'Active', lastLogin: '04 Sep, 9:30 AM' },
  { id: 8,  name: 'Shailesh',         email: 'shailesh@nandifinance.in',         phone: '+91 98001 00008', role: 'Insurance Executive', branch: 'K P Road',                    joined: '15 Jun 2021', status: 'Active', lastLogin: '03 Sep, 5:00 PM' },
  { id: 9,  name: 'Dilip',            email: 'dilip@nandifinance.in',            phone: '+91 98001 00009', role: 'Insurance Executive', branch: 'K P Road',                    joined: '20 Jul 2021', status: 'Active', lastLogin: '04 Sep, 11:00 AM' },
  { id: 10, name: 'Srivasta',         email: 'srivasta@nandifinance.in',         phone: '+91 98001 00010', role: 'Insurance Executive', branch: 'K P Road',                    joined: '01 Aug 2021', status: 'Active', lastLogin: '04 Sep, 9:45 AM' },
  { id: 11, name: 'Anu',              email: 'anu@nandifinance.in',              phone: '+91 98001 00011', role: 'Insurance Executive', branch: 'K P Road',                    joined: '10 Aug 2021', status: 'Active', lastLogin: '04 Sep, 8:30 AM' },
  { id: 12, name: 'Mahesh',           email: 'mahesh@nandifinance.in',           phone: '+91 98001 00012', role: 'Finance Executive',   branch: 'Queens Road',                 joined: '01 Sep 2021', status: 'Active', lastLogin: '03 Sep, 4:00 PM' },
  { id: 13, name: 'Shivu',            email: 'shivu@nandifinance.in',            phone: '+91 98001 00013', role: 'Finance Executive',   branch: 'Queens Road',                 joined: '15 Sep 2021', status: 'Active', lastLogin: '04 Sep, 10:00 AM' },
  { id: 14, name: 'Kavitha',          email: 'kavitha@nandifinance.in',          phone: '+91 98001 00014', role: 'Finance Executive',   branch: 'Queens Road',                 joined: '20 Oct 2021', status: 'Active', lastLogin: '04 Sep, 9:20 AM' },
  { id: 15, name: 'Gajalakshmi',      email: 'gajalakshmi@nandifinance.in',      phone: '+91 98001 00015', role: 'Insurance Executive', branch: 'Banaswadi',                   joined: '01 Nov 2021', status: 'Active', lastLogin: '04 Sep, 8:50 AM' },
  { id: 16, name: 'Nagesh',           email: 'nagesh@nandifinance.in',           phone: '+91 98001 00016', role: 'Insurance Executive', branch: 'Banaswadi',                   joined: '10 Nov 2021', status: 'Active', lastLogin: '04 Sep, 9:05 AM' },
  { id: 17, name: 'Lakshminarayana',  email: 'lakshminarayana@nandifinance.in',  phone: '+91 98001 00017', role: 'Insurance Executive', branch: 'Banaswadi',                   joined: '20 Nov 2021', status: 'Active', lastLogin: '04 Sep, 10:30 AM' },
  { id: 18, name: 'Pavithra',         email: 'pavithra@nandifinance.in',         phone: '+91 98001 00018', role: 'Insurance Executive', branch: 'Banaswadi',                   joined: '01 Dec 2021', status: 'Active', lastLogin: '04 Sep, 9:15 AM' },
  { id: 19, name: 'Harish',           email: 'harish@nandifinance.in',           phone: '+91 98001 00019', role: 'Insurance Executive', branch: 'White Field',                 joined: '10 Dec 2021', status: 'Active', lastLogin: '04 Sep, 8:40 AM' },
  { id: 20, name: 'Pradeep',          email: 'pradeep@nandifinance.in',          phone: '+91 98001 00020', role: 'Insurance Executive', branch: 'White Field',                 joined: '15 Dec 2021', status: 'Active', lastLogin: '04 Sep, 9:50 AM' },
  { id: 21, name: 'Girish',           email: 'girish@nandifinance.in',           phone: '+91 98001 00021', role: 'Insurance Executive', branch: 'B G Road',                    joined: '01 Jan 2022', status: 'Active', lastLogin: '04 Sep, 10:05 AM' },
];

const ROLE_COLORS = {
  'Insurance Executive': { bg: '#f0f4ff', color: '#3b5bdb' },
  'Finance Executive':   { bg: '#e8eef7', color: '#1a3a6b' },
  'Team Leader':         { bg: '#e6f4ed', color: '#1a7a4a' },
};

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }

const AVATAR_COLORS = ['#1a3a6b','#2a5298','#1a7a4a','#b07d1a','#6b3a8a','#2a7a8a','#8a3a3a','#3a6b3a','#c2255c','#3b5bdb'];

export default function UsersPage() {
  const [query, setQuery]       = useState('');
  const [roleFilter, setRole]   = useState('All Roles');
  const [branchFilter, setBranch] = useState('All Branches');
  const [statusFilter, setStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);

  const filtered = USERS.filter(u => {
    const q = query.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = roleFilter   === 'All Roles'    || u.role   === roleFilter;
    const matchBranch = branchFilter === 'All Branches' || u.branch === branchFilter;
    const matchStatus = statusFilter === 'All Status'   || u.status === statusFilter;
    return matchQ && matchRole && matchBranch && matchStatus;
  });

  const roleCounts = ROLES.reduce((acc, r) => ({ ...acc, [r]: USERS.filter(u => u.role === r).length }), {});

  return (
    <div className="users-page">
      <div className="users-topbar">
        <div>
          <div className="users-title">User Management</div>
          <div className="users-sub">Manage all system users, roles and access</div>
        </div>
        <button className="add-user-btn" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="users-body">
        {/* Role summary cards */}
        <div className="role-cards">
          {ROLES.map(r => {
            const rc = ROLE_COLORS[r];
            return (
              <div key={r} className="role-card" style={{ background: rc.bg, borderColor: rc.color + '33' }}
                onClick={() => setRole(roleFilter === r ? 'All Roles' : r)}
              >
                <div className="role-card-count" style={{ color: rc.color }}>{roleCounts[r]}</div>
                <div className="role-card-name" style={{ color: rc.color }}>{r}</div>
              </div>
            );
          })}
        </div>

        {/* Filters row */}
        <div className="users-filters">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search by name or email..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
          </div>
          <select className="filter-select" value={roleFilter} onChange={e => setRole(e.target.value)}>
            <option>All Roles</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <select className="filter-select" value={branchFilter} onChange={e => setBranch(e.target.value)}>
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="filter-count">{filtered.length} users</div>
        </div>

        {/* Table */}
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">No users found</td></tr>
              ) : filtered.map((u, i) => {
                const rc = ROLE_COLORS[u.role];
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{initials(u.name)}</div>
                        <div>
                          <div className="user-name">{u.name}</div>
                          <div className="user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge" style={{ background: rc.bg, color: rc.color }}>{u.role}</span>
                    </td>
                    <td><span className="branch-text">{u.branch}</span></td>
                    <td><span className="phone-text">{u.phone}</span></td>
                    <td><span className="date-text">{u.joined}</span></td>
                    <td><span className="date-text">{u.lastLogin}</span></td>
                    <td>
                      <span className={`status-dot-badge ${u.status === 'Active' ? 'active' : 'inactive'}`}>
                        <span className="dot" />{u.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn act-edit">Edit</button>
                        <button className={`act-btn ${u.status === 'Active' ? 'act-deactivate' : 'act-activate'}`}>
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New User</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-field"><label>Full Name</label><input type="text" placeholder="Enter full name" /></div>
                <div className="modal-field"><label>Email</label><input type="email" placeholder="email@nandifinance.in" /></div>
              </div>
              <div className="modal-row">
                <div className="modal-field"><label>Phone</label><input type="tel" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="modal-field">
                  <label>Role</label>
                  <select><option value="">Select role</option>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Branch</label>
                  <select><option value="">Select branch</option>{BRANCHES.slice(1).map(b => <option key={b}>{b}</option>)}</select>
                </div>
                <div className="modal-field"><label>Employee ID</label><input type="text" placeholder="NF-2025-XXX" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={() => setShowModal(false)}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
