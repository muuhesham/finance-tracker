import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, googleLogin } = useAuth();
  const [error, setError] = useState(null);
  const code = searchParams.get('code');

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
      return;
    }

    async function handleCallback() {
      if (code) {
        try {
          await googleLogin(code);
        } catch (error) {
          console.error('Google login failed:', error);
          setError('Failed to authenticate with Google. Please try again.');
        }
      } else {
        setError('Invalid authentication code.');
      }
    }
    handleCallback();
  }, [code, googleLogin, navigate, token]);

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={() => navigate('/auth')}>Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Authenticating...</h2>
        <p>Please wait while we complete your Google sign-in.</p>
      </div>
    </div>
  );
}
