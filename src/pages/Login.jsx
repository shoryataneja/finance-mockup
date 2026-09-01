import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== 'otp' || timer === 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [step, timer]);

  useEffect(() => {
    if (step === 'otp') setTimeout(() => inputs.current[0]?.focus(), 50);
  }, [step]);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const isFilled = otp.every(d => d !== '');

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">NF</div>
          <span className="brand-name">Nandi Finance</span>
        </div>
        <div className="login-tagline">
          <h1>Smart Bank<br />Recommendations</h1>
          <p>Empower your team with AI-driven bank matching for every customer profile.</p>
        </div>
        <div className="login-stats">
          <div className="stat"><span className="stat-val">500+</span><span className="stat-lbl">Banks Partnered</span></div>
          <div className="stat"><span className="stat-val">98%</span><span className="stat-lbl">Approval Rate</span></div>
          <div className="stat"><span className="stat-val">24h</span><span className="stat-lbl">Avg. Sanction</span></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          {step === 'phone' ? (
            <>
              <div className="card-header">
                <h2>Welcome Back</h2>
                <p>Enter your registered mobile number to continue</p>
              </div>
              <div className="field">
                <label>Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={e => e.key === 'Enter' && phone.length === 10 && setStep('otp')}
                    autoFocus
                  />
                </div>
                <span className="field-hint"></span>
              </div>
              <button
                className="btn-primary"
                disabled={phone.length < 10}
                onClick={() => setStep('otp')}
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <button className="back-btn" onClick={() => { setStep('phone'); setOtp(['','','','']); setTimer(30); }}>
                ← Back
              </button>
              <div className="card-header">
                <h2>Enter OTP</h2>
                <p>We've sent a 4-digit code to <strong>+91 {phone}</strong></p>
              </div>
              <div className="otp-row">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={r => (inputs.current[i] = r)}
                    className={`otp-box${digit ? ' filled' : ''}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKey(e, i)}
                  />
                ))}
              </div>
              <p className="timer-text">
                {timer > 0 ? `Resend code in ${timer}s` : (
                  <button className="resend-btn" onClick={() => setTimer(30)}>Resend Code</button>
                )}
              </p>
              <button
                className="btn-primary"
                disabled={!isFilled}
                onClick={() => navigate('/home')}
              >
                Verify & Login
              </button>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}
