import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, setIsAuthenticated }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    alert('You have been logged out.');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div style={{
      backgroundColor: '#0b061b',
      width: '250px',
      height: '100vh',
      paddingTop: '0',
      padding: '0 20px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '20px',
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: 9998
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        borderTopRightRadius: '20px'
      }}>
        <h2 style={{ color: '#0b061b', margin: 0 }}>Menu</h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <br />
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/tvshows" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>TV Shows</Link>
        <Link to="/movies" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Movies</Link>
        <Link to="/adminmovies" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Manage Movies</Link>
        <br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br />
        <Link to="/privacy" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
        <span
          onClick={handleLogout}
          style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none', cursor: 'pointer' }}
        >
          Log out
        </span>
      </nav>
    </div>
  );
};

export default NavDrawer;
