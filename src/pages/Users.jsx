import { useState } from 'react';
import './Users.css';

const ROLES = ['Finance Executive', 'Senior Executive', 'Team Lead', 'Backend Team'];

const ROLE_COLOR = {
  'Team Lead':         'blue',
  'Senior Executive':  'indigo',
  'Finance Executive': 'green',
  'Backend Team':      'amber',
};

const AVATAR_COLORS = ['#1a3a6b','#1a7a4a','#5c6bc0','#b07d1a','#2a7a8a','#8a3a6b','#b03a2e','#3a6b3a','#1a5a8a','#6b4a1a'];

const INITIAL_USERS = [
  { id: 1,  name: 'Ayush Tyagi',    role: 'Team Lead',         branch: 'Koramangala',  phone: '+91 98765 00001', email: 'ayush.t@nandifinance.in',    status: 'Active',   joined: 'Aug 2021' },
  { id: 2,  name: 'Priya Sharma',   role: 'Finance Executive', branch: 'Koramangala',  phone: '+91 98765 00002', email: 'priya.s@nandifinance.in',    status: 'Active',   joined: 'Jan 2023' },
  { id: 3,  name: 'Rahul Mehta',    role: 'Finance Executive', branch: 'Whitefield',   phone: '+91 98765 00003', email: 'rahul.m@nandifinance.in',    status: 'Active',   joined: 'Mar 2023' },
  { id: 4,  name: 'Sneha Patil',    role: 'Senior Executive',  branch: 'Koramangala',  phone: '+91 98765 00004', email: 'sneha.p@nandifinance.in',    status: 'Active',   joined: 'Jun 2022' },
  { id: 5,  name: 'Amit Verma',     role: 'Finance Executive', branch: 'Jayanagar',    phone: '+91 98765 00005', email: 'amit.v@nandifinance.in',     status: 'Active',   joined: 'Sep 2022' },
  { id: 6,  name: 'Deepika Nair',   role: 'Finance Executive', branch: 'Malleshwaram', phone: '+91 98765 00006', email: 'deepika.n@nandifinance.in',  status: 'Active',   joined: 'Feb 2024' },
  { id: 7,  name: 'Vikram Joshi',   role: 'Senior Executive',  branch: 'Banashankari', phone: '+91 98765 00007', email: 'vikram.j@nandifinance.in',   status: 'Active',   joined: 'May 2021' },
  { id: 8,  name: 'Meera Iyer',     role: 'Finance Executive', branch: 'Whitefield',   phone: '+91 98765 00008', email: 'meera.i@nandifinance.in',    status: 'Inactive', joined: 'Nov 2023' },
  { id: 9,  name: 'Karan Singh',    role: 'Backend Team',      branch: 'Koramangala',  phone: '+91 98765 00009', email: 'karan.s@nandifinance.in',    status: 'Active',   joined: 'Aug 2021' },
  { id: 10, name: 'Ananya Reddy',   role: 'Backend Team',      branch: 'Koramangala',  phone: '+91 98765 00010', email: 'ananya.r@nandifinance.in',   status: 'Active',   joined: 'Dec 2022' },
];

let nextId = 200;
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Finance Executive', branch: '', phone: '', email: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const q = query.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.branch.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchRole && matchQ;
  });

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const addUser = () => {
    if (!form.name.trim() || !form.branch.trim()) return;
    setUsers(prev => [...prev, {
      id: nextId++, ...form,
      name: form.name.trim(), branch: form.branch.trim(),
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      status: 'Active',
      joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    }]);
    setForm({ name: '', role: 'Finance Executive', branch: '', phone: '', email: '' });
    setModal(false);
  };

  const activeCount = users.filter(u => u.status === 'Active').length;

  return (
    <div className="users-page">
      <div className="users-topbar">
        <div>
          <div className="users-title">User Management</div>
          <div className="users-sub">{activeCount} active · {users.length} total users in the system</div>
        </div>
        <button className="users-add-btn" onClick={() => setModal(true)}>+ Add User</button>
      </div>

      <div className="users-body">
        {/* Controls */}
        <div className="users-controls">
          <div className="users-search">
            <span>🔍</span>
            <input
              type="text" placeholder="Search by name, branch or email..."
              value={query} onChange={e => setQuery(e.target.value)}
            />
            {query && <button onClick={() => setQuery('')}>✕</button>}
          </div>
          <div className="users-filters">
            {['All', ...ROLES].map(r => (
              <button
                key={r}
                className={`users-filter-chip${roleFilter === r ? ' active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="users-stats">
          {ROLES.map(r => (
            <div key={r} className={`users-stat users-stat-${ROLE_COLOR[r]}`}>
              <div className="users-stat-val">{users.filter(u => u.role === r).length}</div>
              <div className="users-stat-lbl">{r}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="users-empty">No users found</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td className="users-num">{i + 1}</td>
                  <td>
                    <div className="users-cell">
                      <div className="users-avatar" style={{ background: AVATAR_COLORS[u.id % AVATAR_COLORS.length] }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="users-name">{u.name}</div>
                        <div className="users-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-chip role-${ROLE_COLOR[u.role]}`}>{u.role}</span>
                  </td>
                  <td><span className="users-branch">{u.branch}</span></td>
                  <td><span className="users-phone">{u.phone}</span></td>
                  <td><span className="users-joined">{u.joined}</span></td>
                  <td>
                    <button
                      className={`status-toggle ${u.status === 'Active' ? 'status-active' : 'status-inactive'}`}
                      onClick={() => toggleStatus(u.id)}
                    >
                      <span className="status-dot" />
                      {u.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New User</div>
            <div className="modal-grid">
              <div className="modal-field">
                <label>Full Name *</label>
                <input type="text" placeholder="e.g. Rohit Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Branch *</label>
                <input type="text" placeholder="e.g. Koramangala" value={form.branch} onChange={e => set('branch', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Phone</label>
                <input type="text" placeholder="+91 98765 XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Email</label>
                <input type="text" placeholder="name@nandifinance.in" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
            <div className="modal-field">
              <label>Role *</label>
              <div className="modal-role-chips">
                {ROLES.map(r => (
                  <button
                    key={r}
                    className={`modal-role-chip${form.role === r ? ' active' : ''}`}
                    onClick={() => set('role', r)}
                  >{r}</button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="modal-confirm" disabled={!form.name.trim() || !form.branch.trim()} onClick={addUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
