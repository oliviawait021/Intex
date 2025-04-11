import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import { GoogleLogin } from '@react-oauth/google';
import { baseURL } from '../api/MoviesAPI';
import Footer from '../components/Footer';

function Register() {
  // state variables for email and passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // state variable for error messages
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // handle submit event for the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate email and passwords
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      // clear error message
      setError('');

      // post data to the /register api
      fetch(`${baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        //.then((response) => response.json())
        .then((data) => {
          // handle success or error from the server
          console.log(data);
          if (data.ok) setError('Successful registration. Please log in.');
          else setError('Error registering.');
        })
        .catch((error) => {
          // handle network error
          console.error(error);
          setError('Error registering.');
        });
    }
  };

  return (
    <>
    <div className="auth-wrapper">
      <div className="auth-content">
      <div className="back-button" onClick={() => window.history.back()}>
        &#x2B95;
      </div>
        <img src="/images/logo.png" alt="Logo" className="auth-logo" />
        <div className="auth-card">
          <h2 className="auth-title">Register</h2>
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

            {/* Confirm password field */}
            <div className="auth-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="auth-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="auth-button">
              Register
            </button>

            {/* Or use Google */}
            <div className="auth-input-group">
              <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                or register using
              </p>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log('Google login success:', credentialResponse);
                  // Optionally send token to backend if you do verification on frontend
                }}
                onError={() => {
                  setError('Google login failed');
                }}
              />
            </div>

            {/* Login link */}
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <a href="#" onClick={handleLoginClick} className="auth-link">
                  Return to Login
                </a>
              </p>
            </div>
          </form>

          {/* Error message display */}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Register;
