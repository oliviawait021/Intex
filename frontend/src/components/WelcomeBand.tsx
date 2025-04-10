import { Search } from 'lucide-react';
import { useState, useEffect, SetStateAction } from 'react';
import './WelcomeBand.css';
import NavDrawer from './NavDrawer';

function WelcomeBand() {
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      console.log("username from localStorage:", storedUsername);
    }
  }, []);

  return (
    <>
      <header className="welcome-band">
        <div className="left-header">
          <div className="hamburger-icon">
            <span
              onClick={() => setIsDrawerOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Open menu"
              className="cursor-pointer"
            >
              &#9776;
            </span>
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

      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} setIsAuthenticated={function (_: SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      } } />
    </>
  );
}

export default WelcomeBand;
