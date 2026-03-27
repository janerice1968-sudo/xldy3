
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'eligible' | 'blocked_country' | 'blocked_device' | 'blocked_vpn' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/check-access');
        const data = await response.json();
        
        if (data.status === 'eligible') {
          setStatus('eligible');
          setRedirectUrl(data.redirectUrl);
        } else {
          setStatus(data.status);
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.error("Access check failed:", error);
        setStatus('error');
        setErrorMessage("Connection error. Please try again later.");
      }
    };

    checkAccess();
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="min-h-screen">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at top left, rgba(88, 28, 135, 0.35), transparent 30%),
            radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.35), transparent 30%),
            linear-gradient(135deg, #0b1020, #111827 45%, #1e1b4b 100%);
          color: #ffffff;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
        }

        .card {
          width: 100%;
          max-width: 1080px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex;
          backdrop-filter: blur(12px);
        }

        .left {
          flex: 1.2;
          position: relative;
          display: none;
        }

        @media (min-width: 768px) {
          .left {
            display: block;
          }
        }

        .img-box {
          height: 100%;
          position: relative;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(11, 16, 32, 0.8), transparent);
        }

        .badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #ef4444;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .left-content {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
        }

        .left-content h2 {
          font-size: 32px;
          margin: 0 0 10px;
        }

        .left-content p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .right {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        .header h1 {
          font-size: 36px;
          margin: 0 0 15px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          color: #94a3b8;
          margin: 0 0 40px;
        }

        .status-box {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cta-box {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .benefits {
          display: grid;
          gap: 15px;
          margin-bottom: 40px;
          text-align: left;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
        }

        .icon {
          color: #22c55e;
          font-weight: bold;
        }

        .btn {
          display: block;
          width: 100%;
          background: #6366f1;
          color: white;
          text-decoration: none;
          padding: 20px;
          border-radius: 14px;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
          cursor: pointer;
        }

        .btn:hover {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
        }

        .terms {
          margin-top: 25px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }

        .error-text {
          color: #ef4444;
          font-weight: 500;
        }
      `}</style>
      
      <div className="wrap">
        <div className="card">
          <div className="left">
            <div className="img-box">
              <img src="https://picsum.photos/seed/vibrant/800/1200" alt="Member" referrerPolicy="no-referrer" />
              <div className="overlay"></div>
              <div className="badge">LIVE NOW</div>
            </div>
            <div className="left-content">
              <h2>Premium Access</h2>
              <p>Join our exclusive community of private members.</p>
            </div>
          </div>
          <div className="right">
            <div className="header">
              <h1>lovenightroom</h1>
              <p>Private Member Access</p>
            </div>

            {status === 'checking' && (
              <div className="status-box">
                <div className="loader"></div>
                <p>Checking eligibility...</p>
              </div>
            )}

            {(status === 'blocked_country' || status === 'blocked_device' || status === 'blocked_vpn' || status === 'error') && (
              <div className="status-box">
                <p className="error-text">{errorMessage || "Access Denied"}</p>
              </div>
            )}

            {status === 'eligible' && (
              <div className="cta-box">
                <div className="benefits">
                  <div className="benefit-item">
                    <span className="icon">✓</span>
                    <span>HD Video Streams</span>
                  </div>
                  <div className="benefit-item">
                    <span className="icon">✓</span>
                    <span>Private Chat Rooms</span>
                  </div>
                  <div className="benefit-item">
                    <span className="icon">✓</span>
                    <span>No Credit Card Required</span>
                  </div>
                </div>
                <a className="btn" id="enterBtn" href=" " onClick={handleButtonClick}>
                  ENTER NOW
                </a>
                <p className="terms">By entering, you agree to our Terms of Service and confirm you are 18+.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
