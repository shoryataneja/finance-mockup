import { useState } from 'react';
import './ScoreBands.css';

const BAND_META = [
  { id: 1, label: 'Band 1', track: 'Fast Track',   color: 'green',  cibilLabel: 'Min CIBIL' },
  { id: 2, label: 'Band 2', track: 'Normal Track',  color: 'blue',   cibilLabel: 'Min CIBIL' },
  { id: 3, label: 'Band 3', track: 'Low Track',     color: 'amber',  cibilLabel: 'Max CIBIL' },
  { id: 4, label: 'Band 4', track: 'Waiting',       color: 'red',    cibilLabel: 'Max CIBIL' },
];

const INITIAL_BANDS = [
  { id: 1, minIncome: '50,000', roiMin: '8.60', roiMax: '8.90', cibil: '751', maxFoir: '35', incomeProof: 'Required',     residence: 'OWN' },
  { id: 2, minIncome: '40,000', roiMin: '8.90', roiMax: '9.25', cibil: '726', maxFoir: '40', incomeProof: 'Required',     residence: 'OWN' },
  { id: 3, minIncome: '30,000', roiMin: '9.50', roiMax: '11.00',cibil: '699', maxFoir: '60', incomeProof: 'Not Required', residence: 'OWN, RENTED' },
  { id: 4, minIncome: '25,000', roiMin: '10.00',roiMax: '15.00',cibil: '649', maxFoir: '65', incomeProof: 'Not Required', residence: 'OWN, RENTED' },
];

const INCOME_PROOF_OPTIONS = ['Required', 'Not Required'];
const RESIDENCE_OPTIONS = ['OWN', 'RENTED', 'OWN, RENTED'];

export default function ScoreBandsPage() {
  const [bands, setBands] = useState(INITIAL_BANDS);
  const [editing, setEditing] = useState(null); // band id being edited
  const [draft, setDraft] = useState(null);

  const startEdit = (band) => {
    setDraft({ ...band });
    setEditing(band.id);
  };

  const cancelEdit = () => { setEditing(null); setDraft(null); };

  const saveEdit = () => {
    setBands(prev => prev.map(b => b.id === editing ? { ...draft } : b));
    setEditing(null); setDraft(null);
  };

  const setD = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div className="sb-page">
      <div className="sb-topbar">
        <div>
          <div className="sb-title">Score Band Configuration</div>
          <div className="sb-sub">Configure eligibility criteria and ROI range for each CIBIL score band</div>
        </div>
      </div>

      <div className="sb-body">
        <div className="sb-grid">
          {INITIAL_BANDS.map((_, idx) => {
            const meta  = BAND_META[idx];
            const band  = bands.find(b => b.id === meta.id);
            const isEditing = editing === meta.id;

            return (
              <div key={meta.id} className={`sb-card sb-card-${meta.color}`}>
                {/* Card header */}
                <div className="sb-card-header">
                  <div className="sb-card-header-left">
                    <span className={`sb-band-pill sb-pill-${meta.color}`}>{meta.label}</span>
                    <span className="sb-track">{meta.track}</span>
                  </div>
                  {isEditing ? (
                    <div className="sb-edit-actions">
                      <button className="sb-btn-cancel" onClick={cancelEdit}>Cancel</button>
                      <button className="sb-btn-save" onClick={saveEdit}>Save</button>
                    </div>
                  ) : (
                    <button className="sb-btn-edit" onClick={() => startEdit(band)}>✏ Edit</button>
                  )}
                </div>

                {/* Criteria grid */}
                <div className={`sb-criteria ${isEditing ? 'sb-criteria-editing' : ''}`}>

                  <div className="sb-criterion">
                    <div className="sb-crit-label">Min Income</div>
                    {isEditing
                      ? <input className="sb-input" value={draft.minIncome} onChange={e => setD('minIncome', e.target.value)} placeholder="e.g. 50,000" />
                      : <div className="sb-crit-value">₹{band.minIncome}</div>
                    }
                  </div>

                  <div className="sb-criterion">
                    <div className="sb-crit-label">ROI Range</div>
                    {isEditing
                      ? (
                        <div className="sb-range-row">
                          <input className="sb-input sb-input-sm" value={draft.roiMin} onChange={e => setD('roiMin', e.target.value)} placeholder="8.60" />
                          <span className="sb-range-sep">–</span>
                          <input className="sb-input sb-input-sm" value={draft.roiMax} onChange={e => setD('roiMax', e.target.value)} placeholder="9.25" />
                          <span className="sb-range-unit">%</span>
                        </div>
                      )
                      : <div className="sb-crit-value">{band.roiMin}% – {band.roiMax}%</div>
                    }
                  </div>

                  <div className="sb-criterion">
                    <div className="sb-crit-label">{meta.cibilLabel}</div>
                    {isEditing
                      ? <input className="sb-input" value={draft.cibil} onChange={e => setD('cibil', e.target.value)} placeholder="e.g. 750" />
                      : <div className="sb-crit-value">{band.cibil}</div>
                    }
                  </div>

                  <div className="sb-criterion">
                    <div className="sb-crit-label">Max FOIR</div>
                    {isEditing
                      ? (
                        <div className="sb-range-row">
                          <input className="sb-input sb-input-sm" value={draft.maxFoir} onChange={e => setD('maxFoir', e.target.value)} placeholder="35" />
                          <span className="sb-range-unit">%</span>
                        </div>
                      )
                      : <div className="sb-crit-value">{band.maxFoir}%</div>
                    }
                  </div>

                  <div className="sb-criterion sb-criterion-full">
                    <div className="sb-crit-label">Income Proof</div>
                    {isEditing
                      ? (
                        <div className="sb-chip-row">
                          {INCOME_PROOF_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              className={`sb-chip ${draft.incomeProof === opt ? 'sb-chip-active' : ''}`}
                              onClick={() => setD('incomeProof', opt)}
                            >{opt}</button>
                          ))}
                        </div>
                      )
                      : <div className="sb-crit-value">{band.incomeProof}</div>
                    }
                  </div>

                  <div className="sb-criterion sb-criterion-full">
                    <div className="sb-crit-label">Residence</div>
                    {isEditing
                      ? (
                        <div className="sb-chip-row">
                          {RESIDENCE_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              className={`sb-chip ${draft.residence === opt ? 'sb-chip-active' : ''}`}
                              onClick={() => setD('residence', opt)}
                            >{opt}</button>
                          ))}
                        </div>
                      )
                      : <div className="sb-crit-value">{band.residence}</div>
                    }
                  </div>

                </div>

                {/* CIBIL range indicator bar */}
                <div className={`sb-cibil-bar sb-cibil-bar-${meta.color}`}>
                  <span className="sb-cibil-bar-label">CIBIL {meta.cibilLabel === 'Min CIBIL' ? '≥' : '≤'} {band.cibil}</span>
                  <div className="sb-cibil-track">
                    <div
                      className={`sb-cibil-fill sb-cibil-fill-${meta.color}`}
                      style={{ width: `${Math.min(100, (parseInt(band.cibil) / 900) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
