import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import './WelcomeBand.css';

function WelcomeBand() {
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState<string>('');

  // Retrieve username from localStorage when component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Set the username if available
    }
  }, []);

  return (
    <header className="welcome-band">
      <div className="left-header">
        <div className="hamburger-icon">
          <span>&#9776;</span>
        </div>
        <img src="/images/logo.png" alt="CineNiche Logo" className="logo" />
      </div>

      <div className="welcome-text-container">
        <h2 className="welcome-text">
          {username ? `Welcome ${username}!` : 'Welcome!'}
        </h2>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}

export default WelcomeBand;
