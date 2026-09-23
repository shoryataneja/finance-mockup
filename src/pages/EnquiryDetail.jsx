import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENQUIRIES } from '../data/enquiries';
import './EnquiryDetail.css';

const STAGES = [
  'Inquiry Submitted',
  'Sent to Bank',
  'Under Bank Consideration',
  'Verification / FI',
  'Approved',
  'Agreement Completed',
  'Disbursement Completed',
  'Closed',
];

const STAGE_ACTIONS = [
  null,
  'Send to Bank',
  'Mark Under Consideration',
  'Mark Verification Done',
  'Mark as Approved',
  'Mark Agreement Done',
  'Mark Disbursed',
  'Close Case',
];

const DOC_CATEGORIES = ['KYC', 'Income Proof', 'Bank Statement', 'Vehicle Documents', 'Other'];

const N_DAY_SUGGESTIONS = [
  'CIBIL Pending', 'CIBIL Verified', 'FI Pending', 'FI Done',
  'Waiting for Approval', 'Loan Rejected', 'Agreement Pending',
];

// Fields captured per target stage in the "Update Status" modal.
const STAGE_FIELDS = {
  1: [
    { key: 'date', label: 'Order Date', type: 'date' },
    { key: 'documentsCollectedDate', label: 'Documents Collected Date', type: 'date' },
    { key: 'documentCollectionDelayRemarks', label: 'Collection Delay Remarks', type: 'text', placeholder: 'e.g. Awaiting salary slips' },
    { key: 'loginDate', label: 'Login Date (Nth)', type: 'date' },
    { key: 'nDayStatus', label: 'Nth Day Status', type: 'status', suggestions: N_DAY_SUGGESTIONS },
  ],
  3: [
    { key: 'nPlus1DayStatus', label: '(N+1)th Day Status', type: 'status', suggestions: N_DAY_SUGGESTIONS },
  ],
  4: [
    { key: 'approvalDate', label: 'Approval Date', type: 'date' },
  ],
  5: [
    { key: 'agreementDate', label: 'Agreement Date', type: 'date' },
  ],
  6: [
    { key: 'disbursementDate', label: 'Disbursement Date', type: 'date' },
  ],
};

const UPDATES_KEY = 'enq_updates';

// Fields editable any time from the Loan Processing Timeline card.
const PROCESS_EDIT_FIELDS = [
  { key: 'loginDate', label: 'Login Date (Nth)', type: 'date' },
  { key: 'nDayStatus', label: 'Nth Day Status', type: 'status', suggestions: N_DAY_SUGGESTIONS },
  { key: 'nPlus1DayStatus', label: '(N+1)th Day Status', type: 'status', suggestions: N_DAY_SUGGESTIONS },
];

function loadUpdates() {
  try {
    return JSON.parse(localStorage.getItem(UPDATES_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUpdates(map) {
  try {
    localStorage.setItem(UPDATES_KEY, JSON.stringify(map));
  } catch {
    // ignore storage failures in mockup
  }
}

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Disbursed: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function parseDate(str) {
  if (!str) return null;
  if (/\d{4}-\d{2}-\d{2}/.test(String(str))) {
    const [y, m, d] = String(str).split('-').map(Number);
    const p = new Date(y, m - 1, d);
    return isNaN(p.getTime()) ? null : p;
  }
  const parts = String(str).split(' ');
  if (parts.length < 3) return null;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  if (!month && month !== 0) return null;
  const parsed = new Date(year, month, day);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(from, to) {
  const a = parseDate(from), b = parseDate(to);
  if (!a || !b || b < a) return null;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function toDateInput(value) {
  const d = parseDate(value);
  if (!d) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function toDisplayDate(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    const d = parseDate(value);
    if (!d) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return value;
}

function tatText(from, to) {
  const n = daysBetween(from, to);
  if (n === null || n === undefined) return '—';
  return `${n} day${n === 1 ? '' : 's'}`;
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value ?? '—'}</span>
    </div>
  );
}

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const original = ENQUIRIES.find(e => e.id === Number(id));

  const [enq, setEnq] = useState(() => {
    if (!original) return null;
    const saved = loadUpdates()[original.id] || {};
    return { ...original, ...saved, documents: [...original.documents], history: [...original.history] };
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [remarkModal, setRemarkModal] = useState(null);
  const [remark, setRemark] = useState('');
  const [stageFields, setStageFields] = useState({});
  const [docModal, setDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ category: 'KYC', name: '' });
  const [processModal, setProcessModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editValues, setEditValues] = useState({});

  const EDIT_SECTIONS = {
    finance_bank: {
      title: '🏢 Finance / Bank Details',
      fields: [
        { key: 'bank', label: 'Finance Company' },
        { key: 'bankBranch', label: 'Bank Branch' },
        { key: 'bankExecutive', label: 'Bank Executive' },
        { key: 'branchManager', label: 'Branch Manager' },
        { key: 'branchManagerPhone', label: 'Branch Manager Number' },
        { key: 'branchManagerEmail', label: 'Branch Mail ID' },
      ],
    },
    loan: {
      title: '🏦 Finance Details',
      fields: [
        { key: 'loanAmount', label: 'Loan Amount (₹)', type: 'number' },
        { key: 'downPayment', label: 'Down Payment (₹)', type: 'number' },
        { key: 'netDisbursalAmount', label: 'Net Disbursal Amount (₹)', type: 'number' },
        { key: 'emi', label: 'EMI / Month (₹)', type: 'number' },
        { key: 'roi', label: 'Bank Rate (ROI)' },
        { key: 'customerRate', label: 'Customer Rate' },
        { key: 'ploughBack', label: 'Plough Back (₹)', type: 'number' },
        { key: 'tenure', label: 'Tenure (months)', type: 'number' },
      ],
    },
    vehicle: {
      title: '🚗 Vehicle Details',
      fields: [
        { key: 'make', label: 'Make' },
        { key: 'model', label: 'Model' },
        { key: 'suffix', label: 'Suffix' },
        { key: 'variant', label: 'Variant' },
        { key: 'vehiclePrice', label: 'Vehicle Price (₹)', type: 'number' },
        { key: 'dealer', label: 'Dealer' },
        { key: 'branch', label: 'Dealership Branch' },
        { key: 'invoiceNumber', label: 'Invoice Number' },
        { key: 'rcNumber', label: 'RC Number' },
        { key: 'insuranceCompany', label: 'Insurance Company' },
        { key: 'policyNumber', label: 'Policy Number' },
      ],
    },
    team: {
      title: '👥 Sales & Finance Team',
      fields: [
        { key: 'salesOfficer', label: 'Sales Officer' },
        { key: 'teamLeader', label: 'Team Leader' },
        { key: 'executive', label: 'Finance Executive (FE)' },
        { key: 'teamLead', label: 'Finance Team Lead' },
      ],
    },
  };

  const openEditModal = (section) => {
    const sec = EDIT_SECTIONS[section];
    const vals = sec.fields.reduce((acc, f) => { acc[f.key] = enq[f.key] ?? ''; return acc; }, {});
    setEditValues(vals);
    setEditModal(section);
  };

  const saveEdit = () => {
    const updates = loadUpdates();
    updates[enq.id] = { ...(updates[enq.id] || {}), ...editValues };
    saveUpdates(updates);
    setEnq(e => ({ ...e, ...editValues }));
    setEditModal(null);
    setEditValues({});
  };

  if (!enq) return (
    <div className="detail-not-found">
      <p>Enquiry not found.</p>
      <button onClick={() => navigate('/enquiries')}>← Back to Enquiries</button>
    </div>
  );

  const openStageModal = (stageIdx) => {
    const fields = (STAGE_FIELDS[stageIdx] || []).reduce((acc, f) => {
      acc[f.key] = f.type === 'date' ? toDateInput(enq[f.key]) : (enq[f.key] || '');
      return acc;
    }, {});
    setStageFields(fields);
    setRemark('');
    setRemarkModal({ stageIdx });
  };

  const setField = (key, val) => setStageFields(sf => ({ ...sf, [key]: val }));

  const openProcessModal = () => {
    const fields = PROCESS_EDIT_FIELDS.reduce((acc, f) => {
      acc[f.key] = f.type === 'date' ? toDateInput(enq[f.key]) : (enq[f.key] || '');
      return acc;
    }, {});
    setStageFields(fields);
    setProcessModal(true);
  };

  const saveProcessing = () => {
    const applied = {};
    PROCESS_EDIT_FIELDS.forEach(f => {
      const raw = stageFields[f.key];
      const val = f.type === 'date' ? toDisplayDate(raw) : (raw || '').trim();
      if (val) applied[f.key] = val;
    });

    const statusText = [stageFields.nDayStatus, stageFields.nPlus1DayStatus].filter(Boolean).join(' ').toLowerCase();
    const hasReject = statusText.includes('reject');

    setEnq(e => ({
      ...e,
      ...applied,
      status: hasReject ? 'Rejected' : e.status,
    }));

    if (Object.keys(applied).length > 0) {
      const updates = loadUpdates();
      updates[enq.id] = { ...(updates[enq.id] || {}), ...applied };
      saveUpdates(updates);
    }

    setProcessModal(false);
    setStageFields({});
  };

  const advanceStage = () => {
    if (enq.leadStage >= STAGES.length - 1) return;
    const nextStage = enq.leadStage + 1;

    const applied = {};
    (STAGE_FIELDS[nextStage] || []).forEach(f => {
      const raw = stageFields[f.key];
      const val = f.type === 'date' ? toDisplayDate(raw) : (raw || '').trim();
      if (val) applied[f.key] = val;
    });
    if (applied.date) applied.dateRaw = toDateInput(applied.date);

    const newEntry = {
      date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
      activity: STAGES[nextStage],
      by: 'Admin',
      remarks: remark,
    };

    const allText = [remark, ...Object.values(applied)].filter(Boolean).join(' ').toLowerCase();
    const hasReject = allText.includes('reject');
    const newStatus = hasReject ? 'Rejected' : nextStage === 1 ? 'In-Progress' : nextStage >= 7 ? 'Sanctioned' : 'In-Progress';

    setEnq(e => ({
      ...e,
      ...applied,
      leadStage: nextStage,
      status: newStatus,
      history: [...e.history, newEntry],
    }));

    if (Object.keys(applied).length > 0) {
      const updates = loadUpdates();
      updates[enq.id] = { ...(updates[enq.id] || {}), ...applied };
      saveUpdates(updates);
    }

    setRemarkModal(null);
    setRemark('');
    setStageFields({});
  };

  const addDocument = () => {
    if (!newDoc.name.trim()) return;
    const doc = {
      id: enq.documents.length + 1,
      category: newDoc.category,
      name: newDoc.name.trim(),
      size: '—',
      uploadedBy: 'Admin',
      uploadedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setEnq(e => ({ ...e, documents: [...e.documents, doc] }));
    setNewDoc({ category: 'KYC', name: '' });
    setDocModal(false);
  };

  const docsByCategory = DOC_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = enq.documents.filter(d => d.category === cat);
    return acc;
  }, {});

  const nextActionLabel = enq.leadStage < STAGES.length - 1 ? STAGE_ACTIONS[enq.leadStage + 1] : null;

  return (
    <div className="detail-page">
      {/* Top bar */}
      <div className="detail-topbar">
        <div className="detail-topbar-left">
          <button className="back-btn" onClick={() => navigate('/enquiries')}>
            ← Back
          </button>
          <div>
            <div className="detail-title">
              {enq.name}
              <span className="detail-enq-id">{enq.enquiryId}</span>
            </div>
            <div className="detail-sub">{enq.car} · {enq.variant} · {enq.bank} · {enq.date}</div>
          </div>
        </div>
        <div className="detail-topbar-right">
          <span className={`status-badge ${STATUS_CLASS[enq.status]}`}>{enq.status}</span>
          {nextActionLabel && (
            <button className="action-btn-primary" onClick={() => openStageModal(enq.leadStage + 1)}>
              {nextActionLabel} →
            </button>
          )}
        </div>
      </div>

      {/* Status Tracker */}
      <div className="tracker-bar">
        <div className="tracker-inner">
          {STAGES.map((stage, i) => {
            const done = i < enq.leadStage;
            const current = i === enq.leadStage;
            return (
              <div key={stage} className="tracker-step-wrap">
                <div className={`tracker-step ${done ? 'done' : current ? 'current' : 'upcoming'}`}>
                  <div className="tracker-dot">
                    {done ? '✓' : <span>{i + 1}</span>}
                  </div>
                  <div className="tracker-label">{stage}</div>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`tracker-line ${done ? 'done' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        {['overview', 'documents', 'history'].map(tab => (
          <button
            key={tab}
            className={`detail-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? '📋 Overview' : tab === 'documents' ? `📁 Documents (${enq.documents.length})` : '🕐 History'}
          </button>
        ))}
      </div>

      <div className="detail-body">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            {/* Customer Details */}
            <div className="detail-card">
              <div className="card-title">👤 Customer Details</div>
              <InfoRow label="Full Name" value={enq.name} />
              <InfoRow label="Mobile" value={enq.mobile} />
              <InfoRow label="Date of Birth" value={enq.dob} />
              <InfoRow label="Age" value={`${enq.age} years`} />
              <InfoRow label="Gender" value={enq.gender} />
              <InfoRow label="Marital Status" value={enq.marital} />
              <InfoRow label="Address" value={enq.address} />
              <InfoRow label="Residence" value={enq.residence} />
            </div>

            {/* Employment & Income */}
            <div className="detail-card">
              <div className="card-title">💼 Employment & Income</div>
              <InfoRow label="Profile" value={enq.profile} />
              <InfoRow label="Employer" value={enq.employer} />
              <InfoRow label="Years in Job" value={enq.yearsInJob} />
              <InfoRow label="Monthly Income" value={fmt(enq.income)} />
              <InfoRow label="Existing EMIs" value={fmt(enq.existingEmi)} />
              <InfoRow label="FOIR" value={enq.foir} />
              <InfoRow label="CIBIL Score" value={
                <span className={`cibil-badge ${enq.cibil >= 750 ? 'cibil-good' : enq.cibil >= 700 ? 'cibil-ok' : 'cibil-low'}`}>
                  {enq.cibil}
                </span>
              } />
              <InfoRow label="Additional Income" value={enq.additionalIncome} />
            </div>

            {/* Vehicle Details */}
            <div className="detail-card">
              <div className="card-title card-title-row">🚗 Vehicle Details
                <button className="edit-btn" onClick={() => openEditModal('vehicle')}>✏️ Edit</button>
              </div>
              <InfoRow label="Make" value={enq.make} />
              <InfoRow label="Model" value={enq.model} />
              <InfoRow label="Suffix" value={enq.suffix} />
              <InfoRow label="Variant" value={enq.variant} />
              <InfoRow label="Vehicle Price" value={fmt(enq.vehiclePrice)} />
              <InfoRow label="Dealer" value={enq.dealer} />
              <InfoRow label="Dealership Branch" value={enq.branch} />
              <InfoRow label="Invoice Number" value={enq.invoiceNumber} />
              <InfoRow label="RC Number" value={enq.rcNumber} />
              <div className="co-sub-heading" style={{ marginTop: 12 }}>Insurance</div>
              <InfoRow label="Insurance Company" value={enq.insuranceCompany} />
              <InfoRow label="Policy Number" value={enq.policyNumber} />
            </div>

            {/* Document Collection */}
            <div className="detail-card">
              <div className="card-title">📄 Document Collection</div>
              <InfoRow label="Order Date" value={enq.date} />
              <InfoRow label="Documents Collected Date" value={enq.documentsCollectedDate} />
              <InfoRow label="Order → Documents TAT" value={<span className="tat-badge">{tatText(enq.dateRaw, enq.documentsCollectedDate)}</span>} />
              {enq.documentCollectionDelayRemarks ? (
                <InfoRow label="Delay Remarks" value={enq.documentCollectionDelayRemarks} />
              ) : (
                <InfoRow label="Delay Remarks" value="None" />
              )}
            </div>

            {/* Finance / Bank Details */}
            <div className="detail-card">
              <div className="card-title card-title-row">🏢 Finance / Bank Details
                <button className="edit-btn" onClick={() => openEditModal('finance_bank')}>✏️ Edit</button>
              </div>
              <InfoRow label="Finance Company" value={enq.bank} />
              <InfoRow label="Bank Branch" value={enq.bankBranch} />
              <InfoRow label="Bank Executive" value={enq.bankExecutive} />
              <InfoRow label="Branch Manager" value={enq.branchManager} />
              <InfoRow label="Branch Manager Number" value={enq.branchManagerPhone} />
              <InfoRow label="Branch Mail ID" value={enq.branchManagerEmail} />
            </div>

            {/* Sales & Finance Team */}
            <div className="detail-card">
              <div className="card-title card-title-row">👥 Sales & Finance Team
                <button className="edit-btn" onClick={() => openEditModal('team')}>✏️ Edit</button>
              </div>
              <div className="co-sub-heading">Sales Team</div>
              <InfoRow label="Sales Officer" value={enq.salesOfficer} />
              <InfoRow label="Team Leader" value={enq.teamLeader} />
              <div className="co-sub-heading" style={{ marginTop: 12 }}>Finance Team</div>
              <InfoRow label="FE" value={enq.executive} />
              <InfoRow label="Team Lead" value={enq.teamLead} />
            </div>

            {/* Loan Processing / Timeline */}
            <div className="detail-card processing-card">
              <div className="card-title card-title-row">⏱ Loan Processing Timeline
                <button className="edit-btn" onClick={openProcessModal}>✏️ Update Status</button>
              </div>
              <div className="processing-grid">
                <div className="processing-block">
                  <div className="proc-sub-heading">Login & Processing</div>
                  <InfoRow label="Login Date (Nth)" value={enq.loginDate} />
                  <InfoRow label="Nth Day Status" value={enq.nDayStatus} />
                  <InfoRow label="(N+1)th Day Status" value={enq.nPlus1DayStatus} />
                </div>
                <div className="processing-block">
                  <div className="proc-sub-heading">Approval</div>
                  <InfoRow label="Approval Date" value={enq.approvalDate} />
                  <InfoRow label="Login → Approval TAT" value={<span className="tat-badge">{tatText(enq.loginDate, enq.approvalDate)}</span>} />
                </div>
                <div className="processing-block">
                  <div className="proc-sub-heading">Agreement & Disbursement</div>
                  <InfoRow label="Agreement Date" value={enq.agreementDate} />
                  <InfoRow label="Disbursement Date" value={enq.disbursementDate} />
                  <InfoRow label="Login → Disbursement TAT" value={<span className="tat-badge">{tatText(enq.loginDate, enq.disbursementDate)}</span>} />
                </div>
              </div>
            </div>

            {/* Co-Applicant */}
            {enq.coApplicant && (
              <div className="detail-card co-applicant-card">
                <div className="card-title">👥 Co-Applicant Details
                  <span className="co-relation-badge">{enq.coApplicant.relation}</span>
                </div>
                <div className="co-sub-heading">Personal</div>
                <InfoRow label="Full Name" value={enq.coApplicant.name} />
                <InfoRow label="Mobile" value={enq.coApplicant.mobile} />
                <InfoRow label="Date of Birth" value={enq.coApplicant.dob} />
                <InfoRow label="Age" value={`${enq.coApplicant.age} years`} />
                <InfoRow label="Gender" value={enq.coApplicant.gender} />
                <InfoRow label="Marital Status" value={enq.coApplicant.marital} />
                <InfoRow label="Address" value={enq.coApplicant.address} />
                <InfoRow label="Residence" value={enq.coApplicant.residence} />
                <div className="co-sub-heading" style={{ marginTop: 12 }}>Employment & Income</div>
                <InfoRow label="Profile" value={enq.coApplicant.profile} />
                <InfoRow label="Employer" value={enq.coApplicant.employer} />
                <InfoRow label="Years in Job" value={enq.coApplicant.yearsInJob} />
                <InfoRow label="Monthly Income" value={fmt(enq.coApplicant.income)} />
                <InfoRow label="Existing EMIs" value={fmt(enq.coApplicant.existingEmi)} />
                <InfoRow label="FOIR" value={enq.coApplicant.foir} />
                <InfoRow label="CIBIL Score" value={
                  <span className={`cibil-badge ${enq.coApplicant.cibil >= 750 ? 'cibil-good' : enq.coApplicant.cibil >= 700 ? 'cibil-ok' : 'cibil-low'}`}>
                    {enq.coApplicant.cibil}
                  </span>
                } />
              </div>
            )}

            {/* Finance Details */}
            <div className="detail-card finance-card">
              <div className="card-title card-title-row">🏦 Finance Details
                <button className="edit-btn" onClick={() => openEditModal('loan')}>✏️ Edit</button>
              </div>
              <div className="finance-highlight-row">
                <div className="finance-highlight">
                  <div className="fh-label">Loan Amount</div>
                  <div className="fh-value">{fmt(enq.loanAmount)}</div>
                </div>
                <div className="finance-highlight">
                  <div className="fh-label">Net Disbursal Amount</div>
                  <div className="fh-value">{enq.netDisbursalAmount ? fmt(enq.netDisbursalAmount) : '—'}</div>
                </div>
                <div className="finance-highlight">
                  <div className="fh-label">EMI / Month</div>
                  <div className="fh-value">{fmt(enq.emi)}</div>
                </div>
                <div className="finance-highlight">
                  <div className="fh-label">Bank Rate</div>
                  <div className="fh-value roi-accent">{enq.roi}</div>
                </div>
              </div>
              <InfoRow label="Customer Rate" value={enq.customerRate} />
              <InfoRow label="Plough Back" value={enq.ploughBack ? fmt(enq.ploughBack) : '—'} />
              <InfoRow label="Tenure" value={`${enq.tenure} months`} />
              <InfoRow label="Finance Company" value={enq.bank} />
              <InfoRow label="Down Payment" value={fmt(enq.downPayment)} />
              <InfoRow label="Final Status" value={<span className={`status-badge ${STATUS_CLASS[enq.status]}`}>{enq.status}</span>} />
            </div>
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === 'documents' && (
          <div className="docs-section">
            <div className="docs-header">
              <div>
                <div className="section-title">Document Management</div>
                <div className="section-sub">{enq.documents.length} documents uploaded</div>
              </div>
              <button className="action-btn-primary" onClick={() => setDocModal(true)}>+ Upload Document</button>
            </div>

            {DOC_CATEGORIES.map(cat => (
              docsByCategory[cat].length > 0 && (
                <div key={cat} className="doc-category-block">
                  <div className="doc-cat-title">{cat}</div>
                  <div className="doc-list">
                    {docsByCategory[cat].map(doc => (
                      <div key={doc.id} className="doc-item">
                        <div className="doc-icon">📄</div>
                        <div className="doc-info">
                          <div className="doc-name">{doc.name}</div>
                          <div className="doc-meta">
                            {doc.size} · Uploaded by {doc.uploadedBy} · {doc.uploadedAt}
                          </div>
                        </div>
                        <div className="doc-actions">
                          <button className="doc-btn">View</button>
                          <button className="doc-btn">Download</button>
                          <button className="doc-btn doc-btn-danger">Replace</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}

            {enq.documents.length === 0 && (
              <div className="empty-docs">No documents uploaded yet.</div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="history-section">
            <div className="section-title" style={{ marginBottom: 20 }}>Inquiry Audit Trail</div>
            <div className="timeline">
              {enq.history.map((h, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  {i < enq.history.length - 1 && <div className="timeline-line" />}
                  <div className="timeline-content">
                    <div className="timeline-activity">{h.activity}</div>
                    <div className="timeline-meta">
                      <span className="timeline-by">{h.by}</span>
                      <span className="timeline-date">{h.date}</span>
                    </div>
                    {h.remarks && <div className="timeline-remarks">"{h.remarks}"</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remark Modal */}
      {remarkModal && (
        <div className="modal-overlay" onClick={() => setRemarkModal(null)}>
          <div className="modal-box modal-box-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Status</div>
            <div className="modal-stage-label">→ {STAGES[remarkModal.stageIdx]}</div>

            {STAGE_FIELDS[remarkModal.stageIdx] && (
              <div className="modal-stage-fields">
                <div className="modal-fields-title">Stage details</div>
                <div className="modal-fields-grid">
                  {STAGE_FIELDS[remarkModal.stageIdx].map(f => (
                    <div className="modal-field" key={f.key}>
                      <label>{f.label}</label>
                      {f.type === 'date' ? (
                        <input
                          type="date"
                          value={stageFields[f.key] || ''}
                          onChange={e => setField(f.key, e.target.value)}
                        />
                      ) : f.type === 'status' ? (
                        <>
                          <input
                            className="status-input"
                            list={`nandi-dl-${f.key}`}
                            value={stageFields[f.key] || ''}
                            onChange={e => setField(f.key, e.target.value)}
                            placeholder="Type or choose status..."
                          />
                          <datalist id={`nandi-dl-${f.key}`}>
                            {f.suggestions.map(s => <option key={s} value={s} />)}
                          </datalist>
                        </>
                      ) : (
                        <input
                          type="text"
                          value={stageFields[f.key] || ''}
                          onChange={e => setField(f.key, e.target.value)}
                          placeholder={f.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <textarea
              className="modal-textarea"
              placeholder="Add remarks (optional)..."
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={3}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setRemarkModal(null); setRemark(''); setStageFields({}); }}>Cancel</button>
              <button className="modal-confirm" onClick={advanceStage}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Status Modal */}
      {processModal && (
        <div className="modal-overlay" onClick={() => setProcessModal(false)}>
          <div className="modal-box modal-box-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Processing Status</div>
            <div className="modal-stage-label">N / N+1 Day Tracking · any stage</div>
            <div className="modal-stage-fields">
              <div className="modal-fields-title">Processing details</div>
              <div className="modal-fields-grid">
                {PROCESS_EDIT_FIELDS.map(f => (
                  <div className="modal-field" key={f.key}>
                    <label>{f.label}</label>
                    {f.type === 'date' ? (
                      <input
                        type="date"
                        value={stageFields[f.key] || ''}
                        onChange={e => setField(f.key, e.target.value)}
                      />
                    ) : (
                      <>
                        <input
                          className="status-input"
                          list={`nandi-dl-${f.key}`}
                          value={stageFields[f.key] || ''}
                          onChange={e => setField(f.key, e.target.value)}
                          placeholder="Type or choose status..."
                        />
                        <datalist id={`nandi-dl-${f.key}`}>
                          {f.suggestions.map(s => <option key={s} value={s} />)}
                        </datalist>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setProcessModal(false); setStageFields({}); }}>Cancel</button>
              <button className="modal-confirm" onClick={saveProcessing}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {docModal && (
        <div className="modal-overlay" onClick={() => setDocModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Upload Document</div>
            <div className="modal-field">
              <label>Category</label>
              <select value={newDoc.category} onChange={e => setNewDoc(d => ({ ...d, category: e.target.value }))}>
                {DOC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Document Name</label>
              <input
                type="text"
                placeholder="e.g. Aadhaar Card.pdf"
                value={newDoc.name}
                onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDocModal(false)}>Cancel</button>
              <button className="modal-confirm" onClick={addDocument}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-box modal-box-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Edit {EDIT_SECTIONS[editModal].title}</div>
            <div className="modal-stage-fields">
              <div className="modal-fields-grid">
                {EDIT_SECTIONS[editModal].fields.map(f => (
                  <div className="modal-field" key={f.key}>
                    <label>{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={editValues[f.key] ?? ''}
                      onChange={e => setEditValues(v => ({ ...v, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      placeholder={f.label}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="modal-confirm" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
