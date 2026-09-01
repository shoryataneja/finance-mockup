import { useState } from 'react';
import './Banks.css';

const INITIAL_BANDS = [
  {
    id: 1, label: 'Score Band 1', subtitle: 'CIBIL 750 & above', tag: 'Excellent',
    color: 'green',
    banks: [
      { id: 'b1', name: 'State Bank of India',   roi: '8.60%', type: 'Public Sector' },
      { id: 'b2', name: 'Bank of Baroda',         roi: '8.60%', type: 'Public Sector' },
      { id: 'b3', name: 'Punjab National Bank',   roi: '8.70%', type: 'Public Sector' },
      { id: 'b4', name: 'Kotak Mahindra Bank',    roi: '8.80%', type: 'Private Sector' },
    ],
  },
  {
    id: 2, label: 'Score Band 2', subtitle: 'CIBIL 700 – 749', tag: 'Good',
    color: 'blue',
    banks: [
      { id: 'b5', name: 'HDFC Bank',              roi: '8.90%', type: 'Private Sector' },
      { id: 'b6', name: 'ICICI Bank',             roi: '8.90%', type: 'Private Sector' },
      { id: 'b7', name: 'Yes Bank',               roi: '8.75%', type: 'Private Sector' },
      { id: 'b8', name: 'Axis Bank',              roi: '9.00%', type: 'Private Sector' },
    ],
  },
  {
    id: 3, label: 'Score Band 3', subtitle: 'CIBIL 650 – 699', tag: 'Average',
    color: 'amber',
    banks: [
      { id: 'b9',  name: 'Union Bank of India',   roi: '9.00%', type: 'Public Sector' },
      { id: 'b10', name: 'Federal Bank',          roi: '9.10%', type: 'Private Sector' },
      { id: 'b11', name: 'Canara Bank',           roi: '9.10%', type: 'Public Sector' },
      { id: 'b12', name: 'Indian Bank',           roi: '9.20%', type: 'Public Sector' },
    ],
  },
  {
    id: 4, label: 'Score Band 4', subtitle: 'CIBIL below 650', tag: 'Below Average',
    color: 'red',
    banks: [
      { id: 'b13', name: 'Shriram Finance',       roi: '10.50%', type: 'NBFC' },
      { id: 'b14', name: 'Mahindra Finance',      roi: '10.75%', type: 'NBFC' },
      { id: 'b15', name: 'Cholamandalam Finance', roi: '11.00%', type: 'NBFC' },
    ],
  },
];

let nextId = 100;

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

export default function BanksPage() {
  const [bands, setBands] = useState(INITIAL_BANDS);
  const [modal, setModal] = useState(null); // bandId
  const [form, setForm] = useState({ name: '', roi: '', type: 'Private Sector' });

  const deleteBank = (bandId, bankId) => {
    if (!window.confirm('Remove this bank?')) return;
    setBands(prev => prev.map(b => b.id === bandId
      ? { ...b, banks: b.banks.filter(bk => bk.id !== bankId) }
      : b
    ));
  };

  const openModal = (bandId) => {
    setForm({ name: '', roi: '', type: 'Private Sector' });
    setModal(bandId);
  };

  const addBank = () => {
    if (!form.name.trim() || !form.roi.trim()) return;
    setBands(prev => prev.map(b => b.id === modal
      ? { ...b, banks: [...b.banks, { id: `b${nextId++}`, name: form.name.trim(), roi: form.roi.trim(), type: form.type }] }
      : b
    ));
    setModal(null);
  };

  const totalBanks = bands.reduce((s, b) => s + b.banks.length, 0);

  return (
    <div className="banks-page">
      <div className="banks-topbar">
        <div>
          <div className="banks-title">Bank Management</div>
          <div className="banks-sub">Manage eligible banks by CIBIL score band · {totalBanks} banks configured</div>
        </div>
      </div>

      <div className="banks-body">
        <div className="bands-grid">
          {bands.map(band => (
            <div key={band.id} className={`band-card band-${band.color}`}>
              <div className="band-card-header">
                <div className="band-header-left">
                  <div className="band-label-row">
                    <span className={`band-label band-label-${band.color}`}>{band.label}</span>
                    <span className={`band-tag band-tag-${band.color}`}>{band.tag}</span>
                  </div>
                  <div className="band-subtitle">{band.subtitle}</div>
                </div>
                <div className="band-header-right">
                  <span className="band-count">{band.banks.length} banks</span>
                  <button className={`band-add-btn band-add-${band.color}`} onClick={() => openModal(band.id)}>
                    + Add Bank
                  </button>
                </div>
              </div>

              <div className="bank-list">
                {band.banks.length === 0 && (
                  <div className="bank-empty">No banks configured for this band</div>
                )}
                {band.banks.map((bank, i) => (
                  <div key={bank.id} className="bank-item">
                    <div className={`bank-initials bank-initials-${band.color}`}>{initials(bank.name)}</div>
                    <div className="bank-item-info">
                      <div className="bank-item-name">{bank.name}</div>
                      <div className="bank-item-meta">{bank.type}</div>
                    </div>
                    <div className={`bank-roi bank-roi-${band.color}`}>{bank.roi}</div>
                    <button className="bank-delete-btn" onClick={() => deleteBank(band.id, bank.id)} title="Remove bank">
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Bank</div>
            <div className="modal-band-label">
              {bands.find(b => b.id === modal)?.label} · {bands.find(b => b.id === modal)?.subtitle}
            </div>
            <div className="modal-field">
              <label>Bank Name</label>
              <input type="text" placeholder="e.g. IndusInd Bank" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label>Rate of Interest (ROI)</label>
              <input type="text" placeholder="e.g. 9.25%" value={form.roi} onChange={e => setForm(f => ({ ...f, roi: e.target.value }))} />
            </div>
            <div className="modal-field">
              <label>Bank Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Private Sector</option>
                <option>Public Sector</option>
                <option>NBFC</option>
                <option>Small Finance Bank</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm" disabled={!form.name.trim() || !form.roi.trim()} onClick={addBank}>Add Bank</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
