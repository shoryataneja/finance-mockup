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

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }

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

  const [enq, setEnq] = useState(original ? { ...original, documents: [...original.documents], history: [...original.history] } : null);
  const [activeTab, setActiveTab] = useState('overview');
  const [remarkModal, setRemarkModal] = useState(null); // { stageIdx }
  const [remark, setRemark] = useState('');
  const [docModal, setDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ category: 'KYC', name: '' });

  if (!enq) return (
    <div className="detail-not-found">
      <p>Enquiry not found.</p>
      <button onClick={() => navigate('/enquiries')}>← Back to Enquiries</button>
    </div>
  );

  const advanceStage = () => {
    if (enq.leadStage >= STAGES.length - 1) return;
    const nextStage = enq.leadStage + 1;
    const newEntry = {
      date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
      activity: STAGES[nextStage],
      by: 'Admin',
      remarks: remark,
    };
    const newStatus = nextStage >= 7 ? 'Sanctioned' : nextStage === 5 ? 'Rejected' : 'In-Progress';
    setEnq(e => ({
      ...e,
      leadStage: nextStage,
      status: nextStage === 1 ? 'In-Progress' : nextStage === 4 ? (remark.toLowerCase().includes('reject') ? 'Rejected' : 'In-Progress') : nextStage >= 7 ? 'Sanctioned' : 'In-Progress',
      history: [...e.history, newEntry],
    }));
    setRemarkModal(null);
    setRemark('');
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
            <button className="action-btn-primary" onClick={() => setRemarkModal({ stageIdx: enq.leadStage + 1 })}>
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
              <div className="card-title">🚗 Vehicle Details</div>
              <InfoRow label="Car" value={enq.car} />
              <InfoRow label="Variant" value={enq.variant} />
              <InfoRow label="Vehicle Price" value={fmt(enq.vehiclePrice)} />
              <InfoRow label="Dealer / Branch" value={enq.dealer} />
            </div>

            {/* Finance Details */}
            <div className="detail-card finance-card">
              <div className="card-title">🏦 Finance Details</div>
              <div className="finance-highlight-row">
                <div className="finance-highlight">
                  <div className="fh-label">Loan Amount</div>
                  <div className="fh-value">{fmt(enq.loanAmount)}</div>
                </div>
                <div className="finance-highlight">
                  <div className="fh-label">EMI / Month</div>
                  <div className="fh-value">{fmt(enq.emi)}</div>
                </div>
                <div className="finance-highlight">
                  <div className="fh-label">ROI</div>
                  <div className="fh-value roi-accent">{enq.roi}</div>
                </div>
              </div>
              <InfoRow label="Selected Bank" value={enq.bank} />
              <InfoRow label="Down Payment" value={fmt(enq.downPayment)} />
              <InfoRow label="Vehicle Price" value={fmt(enq.vehiclePrice)} />
              <InfoRow label="Tenure" value={`${enq.tenure} months`} />
              <InfoRow label="Finance Executive" value={enq.executive} />
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
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Status</div>
            <div className="modal-stage-label">→ {STAGES[remarkModal.stageIdx]}</div>
            <textarea
              className="modal-textarea"
              placeholder="Add remarks (optional)..."
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={3}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setRemarkModal(null); setRemark(''); }}>Cancel</button>
              <button className="modal-confirm" onClick={advanceStage}>Confirm Update</button>
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
    </div>
  );
}
