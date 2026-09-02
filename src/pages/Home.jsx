import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENQUIRIES, EXECUTIVES } from '../data/enquiries';
import './Home.css';

const NAME = 'Ayush Tyagi';
const ROLE = 'Admin';

const STATUS_CLASS = {
  Sanctioned: 'status-green',
  Rejected: 'status-red',
  Pending: 'status-amber',
  'In-Progress': 'status-indigo',
};

const BANKS_LIST = ['SBI', 'HDFC', 'ICICI', 'Kotak', 'Axis', 'BOB', 'PNB', 'Yes Bank', 'Federal', 'Union Bank'];
const PROFILES = ['Salaried', 'Business', 'Self Employee', 'Company', 'Agriculture'];
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
const OFFICE_STATUS = ['Company Owned', 'Self Owned'];
const INCOME_PROFILE = ['Income Proof', 'No Income Proof'];
const PROOF_OPTIONS = ['ITR', 'Form 16', 'Rental Agreement', 'GST Certificate', 'ETC'];
const TRACK_STATUS = ['Good', 'Bad'];
const ADDITIONAL_INCOME_SOURCES = ['Income from House Property', 'Agriculture', 'Co-Applicant Income'];
const TENURE_OPTIONS = [12, 24, 36, 48, 60, 72, 84];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }
function fmtNum(v) { return v ? '₹' + Number(v).toLocaleString('en-IN') : '₹0'; }

const STEP_LABELS = ['Personal Info', 'Employment & Finance', 'Vehicle & Loan'];

// ── Step 1 default state ──
const S1_INIT = { name: '', dob: '', age: '', gender: '', marital: '', address: '', residence: '', yearsAtAddress: '', yearsAtCity: '' };
// ── Step 2 default state ──
const S2_INIT = {
  profile: '', yearsInJob: '', officeStatus: '', incomeProfile: '', proofOfIncome: '',
  ifAvailable: [], accountBank: '', existingVehicle: '', vehicleModel: '', trackStatus: '',
  incomePerMonth: '', existingEmiTotal: '', foir: '', cibilScore: '',
  additionalIncome: '', additionalIncomeSource: [], additionalIncomeAmount: '',
  consentGiven: false, consentDateTime: '',
};
// ── Step 3 default state ──
const S3_INIT = { vehicleModel: '', vehiclePrice: '', downPayment: '', tenure: 60 };

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

  // ── Drawer state ──
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState(S1_INIT);
  const [s2, setS2] = useState(S2_INIT);
  const [s3, setS3] = useState(S3_INIT);
  const [submitted, setSubmitted] = useState(false);
  const [generatedId] = useState(() => 'RF-' + String(Math.floor(100000 + Math.random() * 900000)));

  const openDrawer = () => { setStep(1); setS1(S1_INIT); setS2(S2_INIT); setS3(S3_INIT); setSubmitted(false); setDrawerOpen(true); };
  const closeDrawer = () => setDrawerOpen(false);

  // FOIR auto-calc
  useEffect(() => {
    const income = parseFloat(s2.incomePerMonth);
    const emi = parseFloat(s2.existingEmiTotal);
    if (income > 0 && emi >= 0) {
      setS2(f => ({ ...f, foir: ((emi / income) * 100).toFixed(1) + '%' }));
    }
  }, [s2.incomePerMonth, s2.existingEmiTotal]);

  const set1 = (k, v) => setS1(f => ({ ...f, [k]: v }));
  const set2 = (k, v) => setS2(f => ({ ...f, [k]: v }));
  const set3 = (k, v) => setS3(f => ({ ...f, [k]: v }));
  const toggle2 = (k, v) => setS2(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));

  const s1Valid = s1.name && s1.dob && s1.age && s1.gender && s1.marital && s1.address && s1.residence && s1.yearsAtAddress && s1.yearsAtCity;
  const s2Valid = s2.profile && s2.yearsInJob && s2.officeStatus && s2.incomeProfile && s2.proofOfIncome &&
    s2.accountBank && s2.existingVehicle && s2.vehicleModel && s2.trackStatus &&
    s2.incomePerMonth && s2.existingEmiTotal && s2.cibilScore && s2.additionalIncome && s2.consentGiven &&
    (s2.proofOfIncome === 'Not Available' || s2.ifAvailable.length > 0) &&
    (s2.additionalIncome === 'No' || (s2.additionalIncomeSource.length > 0 && s2.additionalIncomeAmount));
  const price = parseFloat(s3.vehiclePrice) || 0;
  const dp = parseFloat(s3.downPayment) || 0;
  const loanAmount = Math.max(0, price - dp);
  const s3Valid = s3.vehicleModel.trim() && price > 0 && dp > 0 && loanAmount > 0;

  const handleSubmit = () => setSubmitted(true);

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
        {/* ── Quick Actions — TOP ── */}
        <div className="quick-actions-bar">
          <div className="qa-bar-left">
            <span className="qa-bar-label">Quick Actions</span>
          </div>
          <div className="qa-bar-right">
            <button className="qa-btn qa-primary" onClick={openDrawer}>
              <span className="qa-icon">＋</span> New Enquiry
            </button>
            <button className="qa-btn qa-outline">
              <span className="qa-icon">📊</span> Generate Report
            </button>
            <button className="qa-btn qa-outline">
              <span className="qa-icon">⬇</span> Export Data
            </button>
            <button className="qa-btn qa-outline" onClick={() => navigate('/enquiries')}>
              <span className="qa-icon">🔍</span> View All Enquiries
            </button>
          </div>
        </div>

        {/* ── KPI ── */}
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

        {/* ── Recent Enquiries ── */}
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
                <th>Customer</th><th>Vehicle</th><th>Bank</th>
                <th>Loan Amount</th><th>ROI</th><th>Executive</th>
                <th>Status</th><th>Date</th>
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
      </div>

      {/* ══════════════════════════════════════════
          NEW ENQUIRY DRAWER
      ══════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>

            {/* Drawer Header */}
            <div className="drawer-header">
              <div>
                <div className="drawer-title">New Enquiry</div>
                <div className="drawer-sub">Fill all 3 steps to submit a loan enquiry</div>
              </div>
              <button className="drawer-close" onClick={closeDrawer}>✕</button>
            </div>

            {/* Step Progress */}
            {!submitted && (
              <div className="step-progress">
                {STEP_LABELS.map((label, i) => {
                  const num = i + 1;
                  const done = step > num;
                  const active = step === num;
                  return (
                    <div key={label} className="step-item">
                      <div className={`step-circle ${done ? 'done' : active ? 'active' : ''}`}>
                        {done ? '✓' : num}
                      </div>
                      <div className={`step-label ${active ? 'active' : done ? 'done' : ''}`}>{label}</div>
                      {i < 2 && <div className={`step-line ${done ? 'done' : ''}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── SUBMITTED ── */}
            {submitted ? (
              <div className="drawer-body success-body">
                <div className="success-icon">✅</div>
                <div className="success-title">Enquiry Submitted!</div>
                <div className="success-id">{generatedId}</div>
                <div className="success-sub">Your enquiry has been created and assigned to the team.</div>
                <div className="success-summary">
                  <div className="ss-row"><span>Customer</span><strong>{s1.name}</strong></div>
                  <div className="ss-row"><span>Vehicle</span><strong>{s3.vehicleModel}</strong></div>
                  <div className="ss-row"><span>Loan Amount</span><strong>{fmtNum(loanAmount)}</strong></div>
                  <div className="ss-row"><span>Tenure</span><strong>{s3.tenure} months</strong></div>
                  <div className="ss-row"><span>CIBIL Score</span><strong>{s2.cibilScore}</strong></div>
                </div>
                <button className="drawer-submit-btn" onClick={closeDrawer}>Done</button>
              </div>
            ) : (

              <div className="drawer-body">

                {/* ════ STEP 1 ════ */}
                {step === 1 && (
                  <div className="form-grid">
                    <div className="form-section-title">Personal Information</div>

                    <div className="fg-full">
                      <FormField label="Full Name">
                        <input className="fi" placeholder="Enter full name" value={s1.name} onChange={e => set1('name', e.target.value)} />
                      </FormField>
                    </div>

                    <FormField label="Date of Birth">
                      <input className="fi" type="date" value={s1.dob} onChange={e => set1('dob', e.target.value)} />
                    </FormField>

                    <FormField label="Age">
                      <input className="fi" placeholder="e.g. 34" type="number" value={s1.age} onChange={e => set1('age', e.target.value)} />
                    </FormField>

                    <FormField label="Gender">
                      <div className="chip-row">
                        {GENDERS.map(g => <Chip key={g} label={g} active={s1.gender === g} onClick={() => set1('gender', g)} />)}
                      </div>
                    </FormField>

                    <FormField label="Marital Status">
                      <div className="chip-row">
                        {MARITAL.map(m => <Chip key={m} label={m} active={s1.marital === m} onClick={() => set1('marital', m)} />)}
                      </div>
                    </FormField>

                    <div className="fg-full">
                      <FormField label="Address">
                        <textarea className="fi fi-ta" placeholder="Enter full address" value={s1.address} onChange={e => set1('address', e.target.value)} />
                      </FormField>
                    </div>

                    <FormField label="Residence Status">
                      <div className="chip-row">
                        {['Own', 'Rented'].map(r => <Chip key={r} label={r} active={s1.residence === r} onClick={() => set1('residence', r)} />)}
                      </div>
                    </FormField>

                    <FormField label="Years at Residence">
                      <input className="fi" placeholder="e.g. 5" type="number" value={s1.yearsAtAddress} onChange={e => set1('yearsAtAddress', e.target.value)} />
                    </FormField>

                    <FormField label="Years at Current City">
                      <input className="fi" placeholder="e.g. 10" type="number" value={s1.yearsAtCity} onChange={e => set1('yearsAtCity', e.target.value)} />
                    </FormField>
                  </div>
                )}

                {/* ════ STEP 2 ════ */}
                {step === 2 && (
                  <div className="form-grid">
                    <div className="form-section-title">Employment & Financial Details</div>

                    <FormField label="Employment Profile">
                      <div className="chip-row">
                        {PROFILES.map(p => <Chip key={p} label={p} active={s2.profile === p} onClick={() => set2('profile', p)} />)}
                      </div>
                    </FormField>

                    <FormField label="Years in Current Job / Business">
                      <input className="fi" placeholder="e.g. 6" type="number" value={s2.yearsInJob} onChange={e => set2('yearsInJob', e.target.value)} />
                    </FormField>

                    <FormField label="Office Address Status">
                      <div className="chip-row">
                        {OFFICE_STATUS.map(o => <Chip key={o} label={o} active={s2.officeStatus === o} onClick={() => set2('officeStatus', o)} />)}
                      </div>
                    </FormField>

                    <FormField label="Income Profile">
                      <div className="chip-row">
                        {INCOME_PROFILE.map(i => <Chip key={i} label={i} active={s2.incomeProfile === i} onClick={() => set2('incomeProfile', i)} />)}
                      </div>
                    </FormField>

                    <FormField label="Proof of Income">
                      <div className="chip-row">
                        {['Available', 'Not Available'].map(p => <Chip key={p} label={p} active={s2.proofOfIncome === p} onClick={() => set2('proofOfIncome', p)} />)}
                      </div>
                    </FormField>

                    {s2.proofOfIncome === 'Available' && (
                      <FormField label="Documents Available">
                        <div className="chip-row">
                          {PROOF_OPTIONS.map(p => <Chip key={p} label={p} active={s2.ifAvailable.includes(p)} onClick={() => toggle2('ifAvailable', p)} />)}
                        </div>
                      </FormField>
                    )}

                    <FormField label="Account Holding Bank">
                      <input className="fi" placeholder="e.g. Federal Bank" value={s2.accountBank} onChange={e => set2('accountBank', e.target.value)} />
                    </FormField>

                    <FormField label="Existing Vehicle">
                      <input className="fi" placeholder="e.g. Yaris" value={s2.existingVehicle} onChange={e => set2('existingVehicle', e.target.value)} />
                    </FormField>

                    <FormField label="Vehicle Model Year">
                      <input className="fi" placeholder="e.g. 2020" type="number" value={s2.vehicleModel} onChange={e => set2('vehicleModel', e.target.value)} />
                    </FormField>

                    <FormField label="Track Status">
                      <div className="chip-row">
                        {TRACK_STATUS.map(t => <Chip key={t} label={t} active={s2.trackStatus === t} onClick={() => set2('trackStatus', t)} />)}
                      </div>
                    </FormField>

                    <FormField label="Monthly Income (₹)">
                      <input className="fi" placeholder="e.g. 85000" type="number" value={s2.incomePerMonth} onChange={e => set2('incomePerMonth', e.target.value)} />
                    </FormField>

                    <FormField label="Existing EMI Total (₹)">
                      <input className="fi" placeholder="e.g. 12000" type="number" value={s2.existingEmiTotal} onChange={e => set2('existingEmiTotal', e.target.value)} />
                    </FormField>

                    <FormField label="FOIR (Auto-calculated)">
                      <div className="fi fi-readonly">{s2.foir || '—'}</div>
                    </FormField>

                    <FormField label="CIBIL Score">
                      <input className="fi" placeholder="e.g. 786" type="number" value={s2.cibilScore} onChange={e => set2('cibilScore', e.target.value)} />
                    </FormField>

                    <FormField label="Additional Income?">
                      <div className="chip-row">
                        {['Yes', 'No'].map(v => <Chip key={v} label={v} active={s2.additionalIncome === v} onClick={() => set2('additionalIncome', v)} />)}
                      </div>
                    </FormField>

                    {s2.additionalIncome === 'Yes' && (
                      <>
                        <FormField label="Additional Income Source">
                          <div className="chip-row">
                            {ADDITIONAL_INCOME_SOURCES.map(s => <Chip key={s} label={s} active={s2.additionalIncomeSource.includes(s)} onClick={() => toggle2('additionalIncomeSource', s)} />)}
                          </div>
                        </FormField>
                        <FormField label="Additional Income Amount (₹)">
                          <input className="fi" placeholder="e.g. 15000" type="number" value={s2.additionalIncomeAmount} onChange={e => set2('additionalIncomeAmount', e.target.value)} />
                        </FormField>
                      </>
                    )}

                    {/* Consent */}
                    <div className="fg-full">
                      <div className="consent-card">
                        <div className="consent-card-title">🔒 Customer Consent</div>
                        <div className="consent-card-sub">The customer has been informed about the credit check and data sharing with financial institutions.</div>
                        <label className="consent-row">
                          <input
                            type="checkbox"
                            className="consent-check"
                            checked={s2.consentGiven}
                            onChange={e => {
                              const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                              set2('consentGiven', e.target.checked);
                              set2('consentDateTime', e.target.checked ? now : '');
                            }}
                          />
                          <span className="consent-text">I confirm that the customer has given verbal/written consent for CIBIL check and loan processing.</span>
                        </label>
                        {s2.consentGiven && s2.consentDateTime && (
                          <div className="consent-timestamp">⏱ Consent recorded at {s2.consentDateTime}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ════ STEP 3 ════ */}
                {step === 3 && (
                  <div className="form-grid">
                    <div className="form-section-title">Vehicle & Loan Details</div>

                    <div className="fg-full">
                      <FormField label="Vehicle Model">
                        <input className="fi" placeholder="e.g. Toyota Hyryder S Hybrid" value={s3.vehicleModel} onChange={e => set3('vehicleModel', e.target.value)} />
                      </FormField>
                    </div>

                    <FormField label="On-Road Price (₹)">
                      <input className="fi" placeholder="e.g. 2426497" type="number" value={s3.vehiclePrice} onChange={e => set3('vehiclePrice', e.target.value)} />
                    </FormField>

                    <FormField label="Down Payment (₹)">
                      <input className="fi" placeholder="e.g. 800000" type="number" value={s3.downPayment} onChange={e => set3('downPayment', e.target.value)} />
                    </FormField>

                    <div className="fg-full">
                      <FormField label="Preferred Tenure (Months)">
                        <div className="chip-row">
                          {TENURE_OPTIONS.map(t => <Chip key={t} label={`${t}m`} active={s3.tenure === t} onClick={() => set3('tenure', t)} />)}
                        </div>
                      </FormField>
                    </div>

                    {price > 0 && dp > 0 && (
                      <div className="fg-full">
                        <div className="loan-preview-card">
                          <div className="lp-row"><span>On-Road Price</span><strong>{fmtNum(price)}</strong></div>
                          <div className="lp-row lp-minus"><span>Down Payment</span><strong>− {fmtNum(dp)}</strong></div>
                          <div className="lp-divider" />
                          <div className="lp-row lp-total"><span>Loan Amount</span><strong>{fmtNum(loanAmount)}</strong></div>
                          <div className="lp-row"><span>Tenure</span><strong>{s3.tenure} months</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Footer Nav ── */}
                <div className="drawer-footer">
                  {step > 1 && (
                    <button className="drawer-back-btn" onClick={() => setStep(s => s - 1)}>← Back</button>
                  )}
                  <div style={{ flex: 1 }} />
                  {step < 3 ? (
                    <button
                      className={`drawer-next-btn${(step === 1 && !s1Valid) || (step === 2 && !s2Valid) ? ' disabled' : ''}`}
                      disabled={(step === 1 && !s1Valid) || (step === 2 && !s2Valid)}
                      onClick={() => setStep(s => s + 1)}
                    >
                      {step === 2 ? 'Check Eligibility →' : 'Next →'}
                    </button>
                  ) : (
                    <button
                      className={`drawer-submit-btn${!s3Valid ? ' disabled' : ''}`}
                      disabled={!s3Valid}
                      onClick={handleSubmit}
                    >
                      Submit Enquiry ✓
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button className={`form-chip${active ? ' active' : ''}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}
