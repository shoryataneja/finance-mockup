import { useState } from 'react';
import './Users.css';

const ROLES = ['Sales Officer', 'Team Leader – Sales', 'Finance Executive', 'Finance Team Lead', 'Bank Executive', 'Branch Manager'];
const BRANCHES = ['All Branches', 'Koramangala', 'KP Road', 'KR Road', 'Bommanhalli', 'Jayanagar', 'Whitefield'];
const STATUSES = ['All Status', 'Active', 'Inactive'];

const USERS = [
  { id: 1,  name: 'Ayush Tyagi',     email: 'ayush.tyagi@nandifinance.in',     phone: '+91 98765 43210', role: 'Finance Team Lead',    branch: 'Koramangala', joined: '15 Mar 2022', status: 'Active',   lastLogin: '04 Sep, 9:10 AM' },
  { id: 2,  name: 'Priya Sharma',    email: 'priya.sharma@nandifinance.in',    phone: '+91 91234 56789', role: 'Finance Executive',     branch: 'Koramangala', joined: '10 Jan 2023', status: 'Active',   lastLogin: '04 Sep, 8:45 AM' },
  { id: 3,  name: 'Rahul Mehta',     email: 'rahul.mehta@nandifinance.in',     phone: '+91 99887 76655', role: 'Finance Executive',     branch: 'KP Road',     joined: '05 Mar 2023', status: 'Active',   lastLogin: '04 Sep, 9:00 AM' },
  { id: 4,  name: 'Sneha Patil',     email: 'sneha.patil@nandifinance.in',     phone: '+91 87654 32109', role: 'Finance Executive',     branch: 'KR Road',     joined: '20 Jun 2022', status: 'Active',   lastLogin: '03 Sep, 6:30 PM' },
  { id: 5,  name: 'Amit Verma',      email: 'amit.verma@nandifinance.in',      phone: '+91 76543 21098', role: 'Finance Executive',     branch: 'Bommanhalli', joined: '12 Sep 2022', status: 'Active',   lastLogin: '04 Sep, 10:15 AM' },
  { id: 6,  name: 'Deepika Nair',    email: 'deepika.nair@nandifinance.in',    phone: '+91 65432 10987', role: 'Finance Executive',     branch: 'Koramangala', joined: '01 Feb 2024', status: 'Active',   lastLogin: '04 Sep, 8:55 AM' },
  { id: 7,  name: 'Karan Singh',     email: 'karan.singh@nandifinance.in',     phone: '+91 54321 09876', role: 'Finance Team Lead',     branch: 'KP Road',     joined: '18 Aug 2021', status: 'Active',   lastLogin: '04 Sep, 9:30 AM' },
  { id: 8,  name: 'Meera Iyer',      email: 'meera.iyer@nandifinance.in',      phone: '+91 43210 98765', role: 'Finance Executive',     branch: 'KR Road',     joined: '15 Nov 2023', status: 'Active',   lastLogin: '03 Sep, 5:00 PM' },
  { id: 9,  name: 'Vikram Joshi',    email: 'vikram.joshi@nandifinance.in',    phone: '+91 32109 87654', role: 'Finance Team Lead',     branch: 'Bommanhalli', joined: '10 May 2021', status: 'Active',   lastLogin: '04 Sep, 11:00 AM' },
  { id: 10, name: 'Rajesh Sharma',   email: 'rajesh.sharma@nandifinance.in',   phone: '+91 98001 23456', role: 'Branch Manager',        branch: 'Koramangala', joined: '01 Jan 2020', status: 'Active',   lastLogin: '04 Sep, 9:45 AM' },
  { id: 11, name: 'Sunita Rao',      email: 'sunita.rao@nandifinance.in',      phone: '+91 97001 23456', role: 'Branch Manager',        branch: 'KP Road',     joined: '15 Mar 2020', status: 'Active',   lastLogin: '04 Sep, 8:30 AM' },
  { id: 12, name: 'Manoj Kumar',     email: 'manoj.kumar@nandifinance.in',     phone: '+91 96001 23456', role: 'Branch Manager',        branch: 'KR Road',     joined: '01 Jun 2020', status: 'Active',   lastLogin: '03 Sep, 4:00 PM' },
  { id: 13, name: 'Anita Desai',     email: 'anita.desai@nandifinance.in',     phone: '+91 95001 23456', role: 'Sales Officer',         branch: 'Jayanagar',   joined: '10 Apr 2023', status: 'Active',   lastLogin: '04 Sep, 10:00 AM' },
  { id: 14, name: 'Rohit Agarwal',   email: 'rohit.agarwal@nandifinance.in',   phone: '+91 94001 23456', role: 'Sales Officer',         branch: 'Whitefield',  joined: '20 Jul 2023', status: 'Active',   lastLogin: '04 Sep, 9:20 AM' },
  { id: 15, name: 'Pooja Desai',     email: 'pooja.desai@nandifinance.in',     phone: '+91 93001 23456', role: 'Team Leader – Sales',   branch: 'Bommanhalli', joined: '05 Feb 2022', status: 'Active',   lastLogin: '04 Sep, 8:50 AM' },
  { id: 16, name: 'Suresh Kumar',    email: 'suresh.kumar@nandifinance.in',    phone: '+91 92001 23456', role: 'Team Leader – Sales',   branch: 'Jayanagar',   joined: '12 Aug 2021', status: 'Inactive', lastLogin: '20 Aug, 3:00 PM' },
  { id: 17, name: 'Nisha Pillai',    email: 'nisha.pillai@nandifinance.in',    phone: '+91 91001 23456', role: 'Bank Executive',        branch: 'KP Road',     joined: '01 Sep 2022', status: 'Active',   lastLogin: '04 Sep, 9:05 AM' },
  { id: 18, name: 'Arjun Nair',      email: 'arjun.nair@nandifinance.in',      phone: '+91 90001 23456', role: 'Bank Executive',        branch: 'KR Road',     joined: '15 Oct 2022', status: 'Active',   lastLogin: '04 Sep, 10:30 AM' },
  { id: 19, name: 'Kavya Reddy',     email: 'kavya.reddy@nandifinance.in',     phone: '+91 89001 23456', role: 'Bank Executive',        branch: 'Koramangala', joined: '20 Jan 2023', status: 'Inactive', lastLogin: '15 Aug, 11:00 AM' },
  { id: 20, name: 'Dinesh Menon',    email: 'dinesh.menon@nandifinance.in',    phone: '+91 88001 23456', role: 'Sales Officer',         branch: 'Whitefield',  joined: '10 Mar 2024', status: 'Active',   lastLogin: '04 Sep, 8:40 AM' },
];

const ROLE_COLORS = {
  'Sales Officer':       { bg: '#f0f4ff', color: '#3b5bdb' },
  'Team Leader – Sales': { bg: '#fff0f6', color: '#c2255c' },
  'Finance Executive':   { bg: '#e8eef7', color: '#1a3a6b' },
  'Finance Team Lead':   { bg: '#e6f4ed', color: '#1a7a4a' },
  'Bank Executive':      { bg: '#fff8e1', color: '#b07d1a' },
  'Branch Manager':      { bg: '#faeaea', color: '#b03a2e' },
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
