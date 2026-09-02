import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENQUIRIES, EXECUTIVES } from '../data/enquiries';
import './Enquiries.css';

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};

const BANKS = [...new Set(ENQUIRIES.map(e => e.bank))].sort();
const STATUSES = ['Sanctioned', 'In-Progress', 'Pending', 'Rejected'];
const BANK_STAGES = ['Sent to Bank', 'Under Bank Consideration', 'Verification / FI', 'Approved', 'Agreement Completed', 'Disbursement'];
const PROFILES = ['Salaried', 'Business'];
const RESIDENCES = ['Own', 'Rented'];
const SORT_OPTIONS = [
  { value: 'date_desc',  label: 'Newest First' },
  { value: 'date_asc',   label: 'Oldest First' },
  { value: 'loan_desc',  label: 'Loan ↓ High' },
  { value: 'loan_asc',   label: 'Loan ↑ Low' },
  { value: 'cibil_desc', label: 'CIBIL ↓ High' },
  { value: 'cibil_asc',  label: 'CIBIL ↑ Low' },
];

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }
function multiLabel(arr, placeholder) {
  if (!arr.length) return placeholder;
  return arr.length === 1 ? arr[0] : `${arr[0]} +${arr.length - 1}`;
}

const INIT_FILTERS = {
  query: '', statuses: [], executives: [], banks: [], bankStages: [],
  profiles: [], residences: [],
  dateFrom: '', dateTo: '',
  loanMin: '', loanMax: '',
  cibilMin: '', cibilMax: '',
  sort: 'date_desc',
};

export default function EnquiriesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INIT_FILTERS);

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const toggleArr = (k, v) => setFilters(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  const resetFilters = () => setFilters(INIT_FILTERS);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.query) n++;
    if (filters.statuses.length) n++;
    if (filters.executives.length) n++;
    if (filters.banks.length) n++;
    if (filters.profiles.length) n++;
    if (filters.residences.length) n++;
    if (filters.dateFrom || filters.dateTo) n++;
    if (filters.loanMin || filters.loanMax) n++;
    if (filters.cibilMin || filters.cibilMax) n++;
    if (filters.bankStages.length) n++;
    return n;
  }, [filters]);

  const filtered = useMemo(() => {
    let list = [...ENQUIRIES];
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) || e.car.toLowerCase().includes(q) ||
        e.bank.toLowerCase().includes(q) || e.enquiryId.toLowerCase().includes(q) ||
        e.executive.toLowerCase().includes(q) || e.employer?.toLowerCase().includes(q)
      );
    }
    if (filters.statuses.length)   list = list.filter(e => filters.statuses.includes(e.status));
    if (filters.executives.length) list = list.filter(e => filters.executives.includes(e.executive));
    if (filters.banks.length)      list = list.filter(e => filters.banks.includes(e.bank));
    if (filters.profiles.length)   list = list.filter(e => filters.profiles.includes(e.profile));
    if (filters.residences.length) list = list.filter(e => filters.residences.includes(e.residence));
    if (filters.dateFrom) list = list.filter(e => e.dateRaw >= filters.dateFrom);
    if (filters.dateTo)   list = list.filter(e => e.dateRaw <= filters.dateTo);
    if (filters.loanMin)  list = list.filter(e => e.loanAmount >= Number(filters.loanMin));
    if (filters.loanMax)  list = list.filter(e => e.loanAmount <= Number(filters.loanMax));
    if (filters.cibilMin) list = list.filter(e => e.cibil >= Number(filters.cibilMin));
    if (filters.cibilMax) list = list.filter(e => e.cibil <= Number(filters.cibilMax));
    if (filters.bankStages.length) list = list.filter(e => e.status === 'In-Progress' && filters.bankStages.includes(e.bankStage));
    list.sort((a, b) => {
      switch (filters.sort) {
        case 'date_asc':   return a.dateRaw.localeCompare(b.dateRaw);
        case 'date_desc':  return b.dateRaw.localeCompare(a.dateRaw);
        case 'loan_desc':  return b.loanAmount - a.loanAmount;
        case 'loan_asc':   return a.loanAmount - b.loanAmount;
        case 'cibil_desc': return b.cibil - a.cibil;
        case 'cibil_asc':  return a.cibil - b.cibil;
        default: return 0;
      }
    });
    return list;
  }, [filters]);

  return (
    <div className="enq-page">
      <div className="enq-topbar">
        <div>
          <div className="enq-page-title">Enquiries</div>
          <div className="enq-page-sub">All customer loan enquiries · click any row to view full details</div>
        </div>
        <div className="enq-count-badge">{filtered.length} of {ENQUIRIES.length} records</div>
      </div>

      <div className="enq-body">

        {/* ── Compact Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search name, vehicle, bank, ID..."
              value={filters.query}
              onChange={e => set('query', e.target.value)}
            />
            {filters.query && <button className="clear-btn" onClick={() => set('query', '')}>✕</button>}
          </div>

          <div className="fb-divider" />

          <DropSelect
            label="Status"
            options={STATUSES}
            selected={filters.statuses}
            onToggle={v => toggleArr('statuses', v)}
            display={multiLabel(filters.statuses, 'All Statuses')}
            active={filters.statuses.length > 0}
          />

          <DropSelect
            label="Executive"
            options={EXECUTIVES}
            selected={filters.executives}
            onToggle={v => toggleArr('executives', v)}
            display={multiLabel(filters.executives, 'All Executives')}
            active={filters.executives.length > 0}
          />

          <DropSelect
            label="Bank"
            options={BANKS}
            selected={filters.banks}
            onToggle={v => toggleArr('banks', v)}
            display={multiLabel(filters.banks, 'All Banks')}
            active={filters.banks.length > 0}
          />

          <DropSelect
            label="Bank Status"
            options={BANK_STAGES}
            selected={filters.bankStages}
            onToggle={v => toggleArr('bankStages', v)}
            display={multiLabel(filters.bankStages, 'All Stages')}
            active={filters.bankStages.length > 0}
          />

          <DropSelect
            label="Profile"
            options={PROFILES}
            selected={filters.profiles}
            onToggle={v => toggleArr('profiles', v)}
            display={multiLabel(filters.profiles, 'All Profiles')}
            active={filters.profiles.length > 0}
          />

          <DropSelect
            label="Residence"
            options={RESIDENCES}
            selected={filters.residences}
            onToggle={v => toggleArr('residences', v)}
            display={multiLabel(filters.residences, 'All Residences')}
            active={filters.residences.length > 0}
          />

          <RangeDropdown
            label="Date"
            active={!!(filters.dateFrom || filters.dateTo)}
            display={filters.dateFrom || filters.dateTo ? `${filters.dateFrom || '…'} → ${filters.dateTo || '…'}` : 'Any Date'}
          >
            <div className="dd-range-body">
              <label className="dd-range-label">From</label>
              <input type="date" className="dd-range-input" value={filters.dateFrom} onChange={e => set('dateFrom', e.target.value)} />
              <label className="dd-range-label">To</label>
              <input type="date" className="dd-range-input" value={filters.dateTo} onChange={e => set('dateTo', e.target.value)} />
            </div>
          </RangeDropdown>

          <RangeDropdown
            label="Loan"
            active={!!(filters.loanMin || filters.loanMax)}
            display={filters.loanMin || filters.loanMax ? `₹${filters.loanMin || '0'} – ₹${filters.loanMax || '∞'}` : 'Any Amount'}
          >
            <div className="dd-range-body">
              <label className="dd-range-label">Min (₹)</label>
              <input type="number" className="dd-range-input" placeholder="e.g. 500000" value={filters.loanMin} onChange={e => set('loanMin', e.target.value)} />
              <label className="dd-range-label">Max (₹)</label>
              <input type="number" className="dd-range-input" placeholder="e.g. 2000000" value={filters.loanMax} onChange={e => set('loanMax', e.target.value)} />
            </div>
          </RangeDropdown>

          <RangeDropdown
            label="CIBIL"
            active={!!(filters.cibilMin || filters.cibilMax)}
            display={filters.cibilMin || filters.cibilMax ? `${filters.cibilMin || '0'} – ${filters.cibilMax || '900'}` : 'Any Score'}
          >
            <div className="dd-range-body">
              <label className="dd-range-label">Min Score</label>
              <input type="number" className="dd-range-input" placeholder="e.g. 650" value={filters.cibilMin} onChange={e => set('cibilMin', e.target.value)} />
              <label className="dd-range-label">Max Score</label>
              <input type="number" className="dd-range-input" placeholder="e.g. 850" value={filters.cibilMax} onChange={e => set('cibilMax', e.target.value)} />
            </div>
          </RangeDropdown>

          <div className="fb-divider" />

          <select className="fb-sort" value={filters.sort} onChange={e => set('sort', e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {activeCount > 0 && (
            <button className="fb-clear" onClick={resetFilters}>✕ Clear {activeCount}</button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="enq-table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No enquiries match your filters</div>
              <div className="empty-sub">Try adjusting or clearing the filters above</div>
              <button className="empty-reset-btn" onClick={resetFilters}>Clear All Filters</button>
            </div>
          ) : (
            <table className="enq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Bank</th>
                  <th>Loan Amount</th>
                  <th>ROI</th>
                  <th>CIBIL</th>
                  <th>Executive</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
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
                      <span className={`cibil-badge ${item.cibil >= 750 ? 'cibil-good' : item.cibil >= 700 ? 'cibil-ok' : 'cibil-low'}`}>
                        {item.cibil}
                      </span>
                    </td>
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
          )}
        </div>
      </div>
    </div>
  );
}

// ── Multi-select dropdown ──
function DropSelect({ label, options, selected, onToggle, display, active }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dd-wrap" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} tabIndex={-1}>
      <button className={`dd-trigger${active ? ' dd-active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="dd-label">{label}</span>
        <span className="dd-value">{display}</span>
        <span className="dd-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="dd-menu">
          {options.map(opt => (
            <label key={opt} className="dd-item">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Range dropdown ──
function RangeDropdown({ label, active, display, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dd-wrap" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} tabIndex={-1}>
      <button className={`dd-trigger${active ? ' dd-active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="dd-label">{label}</span>
        <span className="dd-value">{display}</span>
        <span className="dd-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="dd-menu dd-menu-range">{children}</div>}
    </div>
  );
}
