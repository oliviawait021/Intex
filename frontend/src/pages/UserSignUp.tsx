import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import { baseURL } from '../api/MoviesAPI';

interface UserFormData {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  zip: number;
  netflix: number;
  amazonPrime: number;
  disney: number;
  paramount: number;
  max: number;
  hulu: number;
  appleTv: number;
  peacock: number;
}

const UserSignUp = () => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    phone: '',
    email: '',
    age: 0,
    gender: '',
    city: '',
    state: '',
    zip: 0,
    netflix: 0,
    amazonPrime: 0,
    disney: 0,
    paramount: 0,
    max: 0,
    hulu: 0,
    appleTv: 0,
    peacock: 0,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
            ? 1
            : 0
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${baseURL}/Movie/RegisterUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate('/register');
    } else {
      setError('Failed to register user.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
      <div className="back-button" onClick={() => window.history.back()}>
        &#x2B95;
      </div>
        <img src="/images/logo.png" alt="Logo" className="auth-logo" />
        <div className="auth-card">
          <h2 className="auth-title">User Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {/* User Info Fields */}
            {[
              { name: 'name', type: 'text', label: 'Name' },
              { name: 'phone', type: 'text', label: 'Phone' },
              { name: 'email', type: 'email', label: 'Email' },
              { name: 'age', type: 'number', label: 'Age' },
            ].map(({ name, type, label }) => (
              <div
                className="auth-input-group"
                key={name}
                style={{ marginBottom: '0.75rem' }}
              >
                <label htmlFor={name}>{label}</label>
                <input
                  className="auth-input"
                  type={type}
                  name={name}
                  value={
                    type === 'number' &&
                    formData[name as keyof UserFormData] === 0
                      ? ''
                      : formData[name as keyof UserFormData]
                  }
                  onChange={handleChange}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                />
              </div>
            ))}

            {/* Gender Dropdown (after Age) */}
            <div
              className="auth-input-group"
              style={{ marginBottom: '0.75rem' }}
            >
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="auth-input"
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  width: '100%',
                  height: '2rem',
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* City Input */}
            <div
              className="auth-input-group"
              style={{ marginBottom: '0.75rem' }}
            >
              <label htmlFor="city">City</label>
              <input
                className="auth-input"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              />
            </div>

            {/* State Dropdown */}
            <div
              className="auth-input-group"
              style={{ marginBottom: '0.75rem' }}
            >
              <label htmlFor="state">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="auth-input"
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.9rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  width: '100%',
                  height: '2rem',
                }}
              >
                <option value="">Select State</option>
                {[
                  'AL',
                  'AK',
                  'AZ',
                  'AR',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'FL',
                  'GA',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'OH',
                  'OK',
                  'OR',
                  'PA',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ].map((abbr) => (
                  <option key={abbr} value={abbr}>
                    {abbr}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip Code Input */}
            <div
              className="auth-input-group"
              style={{ marginBottom: '0.75rem' }}
            >
              <label htmlFor="zip">Zip Code</label>
              <input
                className="auth-input"
                type="number"
                name="zip"
                value={formData.zip === 0 ? '' : formData.zip}
                onChange={handleChange}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              />
            </div>

            {/* Streaming Service Checkboxes */}
            <div
              className="auth-input-group"
              style={{ marginBottom: '1.5rem' }}
            >
              <label
                className="auth-label"
                style={{ fontWeight: 'bold', fontSize: '1rem' }}
              >
                Streaming Subscriptions you have{' '}
                <span style={{ fontSize: '0.9rem' }}>
                  (Select all that apply):
                </span>
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem 1.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {[
                  { key: 'netflix', label: 'Netflix' },
                  { key: 'amazonPrime', label: 'Amazon Prime' },
                  { key: 'disney', label: 'Disney+' },
                  { key: 'paramount', label: 'Paramount+' },
                  { key: 'max', label: 'Max' },
                  { key: 'hulu', label: 'Hulu' },
                  { key: 'appleTv', label: 'Apple TV+' },
                  { key: 'peacock', label: 'Peacock' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem 1.25rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={!!formData[key as keyof UserFormData]}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-button">
              Submit
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
