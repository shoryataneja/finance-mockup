import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENQUIRIES, EXECUTIVES } from '../data/enquiries';
import './Enquiries.css';

const TAG_COLORS = [
  { id: 'red',    label: 'Red',    hex: '#ef4444' },
  { id: 'orange', label: 'Orange', hex: '#f97316' },
  { id: 'yellow', label: 'Yellow', hex: '#eab308' },
  { id: 'green',  label: 'Green',  hex: '#22c55e' },
  { id: 'blue',   label: 'Blue',   hex: '#3b82f6' },
  { id: 'purple', label: 'Purple', hex: '#a855f7' },
];

function useTags() {
  const [tags, setTags] = useState(() => {
    try { return JSON.parse(localStorage.getItem('enq_tags') || '{}'); } catch { return {}; }
  });
  const save = (next) => { setTags(next); localStorage.setItem('enq_tags', JSON.stringify(next)); };
  const setTag = (id, color, note) => save({ ...tags, [id]: { color, note } });
  const removeTag = (id) => { const next = { ...tags }; delete next[id]; save(next); };
  return { tags, setTag, removeTag };
}

const STATUS_CLASS = {
  'In-Progress': 'status-indigo',
  Sanctioned: 'status-green',
  Disbursed: 'status-green',
  Rejected: 'status-red',
};

const BANKS = [...new Set(ENQUIRIES.map(e => e.bank))].sort();
const STATUSES = ['In-Progress', 'Sanctioned', 'Disbursed', 'Rejected'];
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
  tagColors: [],
  sort: 'date_desc',
};

export default function EnquiriesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INIT_FILTERS);
  const { tags, setTag, removeTag } = useTags();
  const [tagPopover, setTagPopover] = useState(null); // { id, x, y }

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
    if (filters.tagColors.length) n++;
    return n;
  }, [filters]);

  const filtered = useMemo(() => {
    let list = [...ENQUIRIES];
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) || e.car.toLowerCase().includes(q) ||
        e.bank.toLowerCase().includes(q) || e.enquiryId.toLowerCase().includes(q) ||
        e.executive.toLowerCase().includes(q) || e.employer?.toLowerCase().includes(q) ||
        e.make?.toLowerCase().includes(q) || e.model?.toLowerCase().includes(q) ||
        e.variant?.toLowerCase().includes(q) || e.salesOfficer?.toLowerCase().includes(q)
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
    if (filters.tagColors.length) list = list.filter(e => tags[e.id] && filters.tagColors.includes(tags[e.id].color));
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

  const handleRowContextMenu = (e, id) => {
    e.preventDefault();
    setTagPopover({ id, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="enq-page" onClick={() => setTagPopover(null)}>
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
              placeholder="Search name, vehicle, make, model, variant, sales officer, bank, ID..."
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

          <DropSelect
            label="Tag"
            options={TAG_COLORS.map(c => c.id)}
            selected={filters.tagColors}
            onToggle={v => toggleArr('tagColors', v)}
            display={filters.tagColors.length === 0 ? 'All Tags' : filters.tagColors.length === 1 ? TAG_COLORS.find(c => c.id === filters.tagColors[0])?.label : `${filters.tagColors.length} colors`}
            active={filters.tagColors.length > 0}
            renderOption={(opt) => {
              const c = TAG_COLORS.find(x => x.id === opt);
              return <><span className="tag-swatch" style={{ background: c.hex }} />{c.label}</>;
            }}
          />

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
                  <tr
                    key={item.id}
                    className="clickable-row"
                    style={tags[item.id] ? { '--tag-color': TAG_COLORS.find(c => c.id === tags[item.id].color)?.hex } : {}}
                    onClick={() => navigate(`/enquiries/${item.id}`)}
                    onContextMenu={e => handleRowContextMenu(e, item.id)}
                  >
                    <td className="row-num">
                      {tags[item.id] && <span className="tag-dot" style={{ background: TAG_COLORS.find(c => c.id === tags[item.id].color)?.hex }} />}
                      {i + 1}
                    </td>
                    <td>
                      <div className="cust-cell">
                        <div className="cust-avatar">{initials(item.name)}</div>
                        <div>
                          <div className="cust-name">
                            {item.name}
                            {tags[item.id]?.note && <span className="tag-note-pill" style={{ background: TAG_COLORS.find(c => c.id === tags[item.id].color)?.hex + '22', color: TAG_COLORS.find(c => c.id === tags[item.id].color)?.hex }}>{tags[item.id].note}</span>}
                          </div>
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

      {tagPopover && (
        <TagPopover
          id={tagPopover.id}
          x={tagPopover.x}
          y={tagPopover.y}
          current={tags[tagPopover.id]}
          onSave={(color, note) => { setTag(tagPopover.id, color, note); setTagPopover(null); }}
          onRemove={() => { removeTag(tagPopover.id); setTagPopover(null); }}
          onClose={() => setTagPopover(null)}
        />
      )}
    </div>
  );
}

// ── Tag Popover ──
function TagPopover({ id, x, y, current, onSave, onRemove, onClose }) {
  const [color, setColor] = useState(current?.color || TAG_COLORS[0].id);
  const [note, setNote] = useState(current?.note || '');
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth) el.style.left = (x - rect.width) + 'px';
    if (rect.bottom > window.innerHeight) el.style.top = (y - rect.height) + 'px';
  }, []);

  return (
    <div
      ref={ref}
      className="tag-popover"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      <div className="tag-popover-title">🏷️ Tag Enquiry</div>
      <div className="tag-color-row">
        {TAG_COLORS.map(c => (
          <button
            key={c.id}
            className={`tag-color-btn${color === c.id ? ' selected' : ''}`}
            style={{ background: c.hex }}
            title={c.label}
            onClick={() => setColor(c.id)}
          />
        ))}
      </div>
      <input
        className="tag-note-input"
        placeholder="Add a note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        maxLength={30}
      />
      <div className="tag-popover-actions">
        {current && <button className="tag-remove-btn" onClick={onRemove}>Remove</button>}
        <button className="tag-save-btn" onClick={() => onSave(color, note)}>Save Tag</button>
      </div>
    </div>
  );
}

// ── Multi-select dropdown ──
function DropSelect({ label, options, selected, onToggle, display, active, renderOption }) {
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
              {renderOption ? renderOption(opt) : <span>{opt}</span>}
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
