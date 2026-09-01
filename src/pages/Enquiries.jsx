import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENQUIRIES } from '../data/enquiries';
import './Enquiries.css';

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};
const FILTERS = ['All', 'Sanctioned', 'In-Progress', 'Pending', 'Rejected'];

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function EnquiriesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = ENQUIRIES.filter(e => {
    const matchFilter = filter === 'All' || e.status === filter;
    const q = query.toLowerCase();
    const matchQuery = !q || e.name.toLowerCase().includes(q) || e.car.toLowerCase().includes(q) || e.bank.toLowerCase().includes(q) || e.enquiryId.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  return (
    <div className="enq-page">
      <div className="enq-topbar">
        <div>
          <div className="enq-page-title">Recent Enquiries</div>
          <div className="enq-page-sub">All customer loan enquiries · click any row to view full details</div>
        </div>
        <div className="enq-count-badge">{filtered.length} records</div>
      </div>

      <div className="enq-body">
        <div className="enq-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, vehicle, bank or ID..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
          </div>
          <div className="filter-chips">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-chip${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="enq-table-wrap">
          <table className="enq-table">
            <thead>
              <tr>
                <th>#</th>
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
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="empty-row">No enquiries found</td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} className="clickable-row" onClick={() => navigate(`/enquiries/${item.id}`)}>
                  <td className="row-num">{i + 1}</td>
                  <td>
                    <div className="cust-cell">
                      <div className="cust-avatar">{initials(item.name)}</div>
                      <div>
                        <div className="cust-name">{item.name}</div>
                        <div className="cust-id">{item.enquiryId}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="car-text">🚗 {item.car} · {item.variant}</span></td>
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
      </div>
    </div>
  );
}
