import { useNavigate } from 'react-router-dom';
import { ENQUIRIES } from '../data/enquiries';
import './Home.css';

const NAME = 'Ayush Tyagi';
const ROLE = 'Team Lead';

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function HomePage() {
  const navigate = useNavigate();
  const RECENT = ENQUIRIES.slice(0, 5);

  const KPI = [
    { label: 'Total Enquiries', value: ENQUIRIES.length,                                         color: 'blue',   icon: '📋' },
    { label: 'Sanctioned',      value: ENQUIRIES.filter(e => e.status === 'Sanctioned').length,  color: 'green',  icon: '✅' },
    { label: 'In Progress',     value: ENQUIRIES.filter(e => e.status === 'In-Progress').length, color: 'indigo', icon: '🔄' },
    { label: 'Pending',         value: ENQUIRIES.filter(e => e.status === 'Pending').length,     color: 'amber',  icon: '⏳' },
    { label: 'Rejected',        value: ENQUIRIES.filter(e => e.status === 'Rejected').length,    color: 'red',    icon: '❌' },
  ];

  return (
    <div className="home">
      <div className="home-topbar">
        <div>
          <div className="home-greeting">{getGreeting()}</div>
          <div className="home-name">{NAME}</div>
          <div className="home-role">{ROLE} · Nandi Finance</div>
        </div>
        <div className="home-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      <div className="home-body">
        <div className="kpi-row">
          {KPI.map(k => (
            <div key={k.label} className={`kpi-card kpi-${k.color}`}>
              <div className="kpi-top">
                <div className="kpi-icon-wrap">{k.icon}</div>
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-head">
            <div>
              <div className="section-title">Recent Enquiries</div>
              <div className="section-sub">Latest 5 enquiries · click any row to view details</div>
            </div>
            <a href="/enquiries" className="see-all-btn">View All →</a>
          </div>

          <table className="enq-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Bank</th>
                <th>Loan Amount</th>
                <th>ROI</th>
                <th>Executive</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map(item => (
                <tr key={item.id} className="clickable-row" onClick={() => navigate(`/enquiries/${item.id}`)}>
                  <td>
                    <div className="cust-cell">
                      <div className="cust-avatar">{initials(item.name)}</div>
                      <div>
                        <div className="cust-name">{item.name}</div>
                        <div className="cust-id">{item.enquiryId}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="car-text">{item.car} · {item.variant}</span></td>
                  <td><span className="bank-chip">{item.bank}</span></td>
                  <td><span className="loan-text">{fmt(item.loanAmount)}</span></td>
                  <td><span className="roi-text">{item.roi}</span></td>
                  <td>
                    <div className="exec-cell">
                      <div className="exec-avatar">{initials(item.executive)}</div>
                      <span className="exec-name">{item.executive}</span>
                    </div>
                  </td>
                  <td><span className={`status-badge ${STATUS_CLASS[item.status]}`}>{item.status}</span></td>
                  <td><span className="date-text">{item.date}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="quick-actions">
          <div className="qa-title">Quick Actions</div>
          <div className="qa-row">
            <button className="qa-btn qa-primary">+ New Enquiry</button>
            <button className="qa-btn qa-outline">Generate Report</button>
            <button className="qa-btn qa-outline">Export Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
