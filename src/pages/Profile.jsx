import { useNavigate } from 'react-router-dom';
import './Profile.css';

const USER = {
  name: 'Ayush Tyagi',
  designation: 'Team Lead',
  employeeId: 'NF-2024-031',
  email: 'ayush.tyagi@nandifinance.in',
  phone: '+91 98765 43210',
  branch: 'Bangalore – Koramangala',
  joiningDate: '15 March 2022',
  status: 'Active',
  reportingTo: 'Rajesh Sharma',
  teamSize: '8 members',
  region: 'South India',
};

function InfoRow({ label, value, highlight }) {
  return (
    <div className="info-row">
      <div className="info-content">
        <div className="info-label">{label}</div>
        <div className={`info-value${highlight ? ' highlight' : ''}`}>{value}</div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="info-card">
      <div className="info-card-title">{title}</div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const initials = USER.name.split(' ').map(w => w[0]).join('');

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <div className="profile-page-title">My Profile</div>
        <div className="profile-page-sub">Your account information and work details</div>
      </div>

      <div className="profile-body">
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{USER.name}</div>
            <div className="profile-hero-designation">{USER.designation}</div>
            <div className="profile-hero-branch">{USER.branch}</div>
            <div className="profile-status-badge">
              <span className="status-dot" />
              {USER.status}
            </div>
          </div>
          <div className="profile-hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-val">12</div>
              <div className="hero-stat-lbl">Enquiries</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-val">7</div>
              <div className="hero-stat-lbl">Sanctioned</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-val">{USER.teamSize}</div>
              <div className="hero-stat-lbl">Team Size</div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <InfoCard title="Personal Details">
            <InfoRow label="Employee ID"  value={USER.employeeId} />
            <InfoRow label="Email"        value={USER.email} />
            <InfoRow label="Phone"        value={USER.phone} />
          </InfoCard>

          <InfoCard title="Work Details">
            <InfoRow label="Designation"  value={USER.designation} />
            <InfoRow label="Branch"       value={USER.branch} />
            <InfoRow label="Joining Date" value={USER.joiningDate} />
            <InfoRow label="Reporting To" value={USER.reportingTo} />
            <InfoRow label="Region"       value={USER.region} />
            <InfoRow label="Status"       value={USER.status} highlight />
          </InfoCard>
        </div>

        <button className="logout-full-btn" onClick={() => navigate('/')}>
          Logout
        </button>
      </div>
    </div>
  );
}
