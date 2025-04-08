import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      fetch('https://localhost:5000/register', {
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
    <div style={{ backgroundColor: '#0a0617', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1.5rem' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem',  textAlign: 'left' }}>Username</label>
            <input
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem',  textAlign: 'left' }}>Password</label>
            <input
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem',  textAlign: 'left' }}>Confirm Password</label>
            <input
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#0a0617',
              color: 'white',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: 'none',
              marginBottom: '0.5rem'
            }}
          >
            Register
          </button>
          <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>
            <p>
              <a href="#" onClick={handleLoginClick} style={{ textDecoration: 'underline' }}>Return to Login</a>
            </p>
          </div>
        </form>
        {error && <p className="error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
