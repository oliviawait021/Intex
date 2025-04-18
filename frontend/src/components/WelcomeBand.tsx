import { useState, useEffect, SetStateAction } from 'react';
import './WelcomeBand.css';
import NavDrawer from './NavDrawer';
import { baseURL } from '../api/MoviesAPI';

function WelcomeBand() {
  const [username, setUsername] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${baseURL}/pingauth`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Auth check:", data);

          localStorage.setItem("username", data.email);
          localStorage.setItem("isAdmin", data.isAdmin);
          localStorage.setItem("isAuthenticated", "true");
          setUsername(data.email);
        } else {
          console.log("🚫 Not authenticated");
          localStorage.removeItem("username");
          localStorage.removeItem("isAdmin");
          localStorage.setItem("isAuthenticated", "false");
          setUsername('');
        }
      } catch (err) {
        console.error("⚠️ Error checking auth:", err);
      }
    };

    checkAuth();
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
          <img src="/images/logo.png" alt="CineNiche Logo" className="logo-in-band" />
        </div>

        <div className="welcome-text-container">
          <h2 className="welcome-text">
            {username ? `Welcome ${username}!` : 'Welcome!'}
          </h2>
        </div>

        {/* <div className="search-bar-container">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> 
        </div>*/}
      </header>

      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} setIsAuthenticated={function (_: SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      } } />
    </>
  );
}

export default WelcomeBand;
