import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const NAV = [
  { to: '/home',       label: 'Home' },
  { to: '/enquiries',  label: 'Recent Enquiries' },
  { to: '/team',       label: 'Team Breakdown' },
  { to: '/users',      label: 'User Management' },
  { to: '/branches',   label: 'Branch Management' },
  { to: '/profile',    label: 'Profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">NF</div>
        <div>
          <div className="sidebar-brand-name">Nandi Finance</div>
          <div className="sidebar-brand-sub">Internal Portal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-label">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AT</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Ayush Tyagi</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => navigate('/')}>
          <span>⏻</span>
        </button>
      </div>
    </aside>
  );
}
