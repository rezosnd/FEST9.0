import { useState } from 'react';
import Layout from '../components/Layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Enter your email and OTP to continue.');

  const EXPECTED_OTP = '123456';
  const PAC_SPEED = 2000; // ms
  const GHOST_RUN_TIME = 2300; // ms after ghost enters (matches reference delay + glide)

  const runAnimation = () => {
    setIsRunning(true);
    setShowGhost(false);
    setSuccess(false);
    setIsInvalid(false);
    setStatusMessage('Verifying...');
    setTimeout(() => setShowGhost(true), PAC_SPEED);
  };

  const finishAnimation = (isMatch) => {
    setTimeout(() => {
      setIsRunning(false);
      setSuccess(isMatch);
      setIsInvalid(!isMatch);
      setStatusMessage(isMatch ? 'Access granted — game on!' : 'Wrong OTP — try again.');
      setTimeout(() => setShowGhost(false), 500);
    }, PAC_SPEED + GHOST_RUN_TIME);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (isRunning) return;
    runAnimation();
    const isMatch = otp.trim() === EXPECTED_OTP;
    finishAnimation(isMatch);
  };

  const handleSendOtp = () => {
    if (isRunning) return;
    setOtp('');
    setShowGhost(false);
    setSuccess(false);
    setIsInvalid(false);
    setStatusMessage('OTP sent! Enter it to play.');
  };

  return (
    <Layout title="Login">
      <div className="login-shell">
        <div className="login-card">
          <h1 className="login-title">Arcade Login</h1>
          <form className="login-form" onSubmit={handleVerify}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@kiitfest.com"
              required
            />

            <label htmlFor="otp">OTP</label>
            <div
              className={`scene-wrapper ${isRunning ? 'is-running' : ''} ${showGhost ? 'show-ghost' : ''} ${success ? 'is-success' : ''}`}
            >
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                disabled={isRunning}
                className={isInvalid ? 'invalid' : ''}
              />
              <div className="input-cover" aria-hidden />
              <div className={`pac-wrapper ${isRunning ? 'is-running' : ''}`} aria-hidden>
                <div className="pacman" />
              </div>
              <div
                className={`ghost-wrapper ${showGhost ? 'is-live' : ''} ${success ? 'is-success' : ''}`}
                aria-hidden
              >
                <div className={`ghost ${success ? 'runaway' : ''}`} />
              </div>
            </div>

            <div className="login-actions">
              <button type="button" onClick={handleSendOtp}>Send OTP</button>
              <button type="submit" disabled={isRunning}>Verify &amp; Play</button>
            </div>
          </form>

          <div className={`login-status ${success ? 'success' : ''} ${isInvalid ? 'error' : ''}`}>
            {statusMessage}
          </div>
        </div>
      </div>
    </Layout>
  );
}
