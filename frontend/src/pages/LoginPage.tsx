import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Identity.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/SignUp');
  };

  // handle submit event for the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const loginUrl = rememberme
      ? 'https://localhost:5000/login?useCookies=true'
      : 'https://localhost:5000/login?useSessionCookies=true';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // ✅ Ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Ensure we only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      // Store username in localStorage (or sessionStorage, depending on your preference)
      localStorage.setItem('username', email);

      navigate('/movies');
      setTimeout(() => {
        window.location.reload();
      }, 200); // short delay to ensure cookies/session updates are processed
    } catch (error: any) {
      // handle network or fetch error
      setError(error.message || 'Error logging in.');
      console.error('Fetch attempt failed:', error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <img src="/images/logo.png" alt="Logo" className="auth-logo" />
        <div className="auth-card">
          <h2 className="auth-title">Sign in to continue</h2>
          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="auth-input-group">
              <label htmlFor="email">Username</label>
              <input
                className="auth-input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>

            {/* Password field */}
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input
                className="auth-input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>

            {/* Remember me checkbox */}
            <div className="auth-input-group" style={{ fontSize: '1rem' }}>
              <input
                type="checkbox"
                id="rememberme"
                name="rememberme"
                checked={rememberme}
                onChange={handleChange}
              />
              <label htmlFor="rememberme" style={{ marginLeft: '0.5rem' }}>
                Remember me?
              </label>
            </div>

            {/* Submit button */}
            <button type="submit" className="auth-button">
              Sign In
            </button>

            {/* Register link */}
            <div className="auth-footer">
              <p>
                Don’t have an account?{' '}
                <a href="#" onClick={handleRegisterClick} className="auth-link">
                  Sign up here
                </a>
              </p>
            </div>
          </form>

          {/* Third-party login buttons */}
          <div className="auth-input-group">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                console.log('Google login success:', credentialResponse);

                const token = credentialResponse.credential;

                try {
                  const response = await fetch(
                    'https://localhost:5000/api/auth/google',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include', // This allows the cookie to be set
                      body: JSON.stringify({
                        token: token,
                      }),
                    }
                  );

                  if (!response.ok) {
                    throw new Error('Failed to log in via Google');
                  }

                  const data = await response.json();
                  console.log('Backend login success:', data);
                  navigate('/movies');
                  setTimeout(() => {
                    window.location.reload();
                  }, 200);
                } catch (error) {
                  console.error('Error during Google login:', error);
                }
              }}
              onError={() => {
                console.log('Google login failed');
                setError('Google login failed');
              }}
            />
          </div>

          {/* Error message display */}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
