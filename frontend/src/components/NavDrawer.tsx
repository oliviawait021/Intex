import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { baseURL } from '../api/MoviesAPI';
import Logout from './Logout';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseURL}/pingauth`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const role = data.roles && data.roles.length > 0 ? data.roles[0] : 'Customer';
          setUserRole(role);
          localStorage.setItem('userRole', role);
        } else {
          setUserRole(null);
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserRole(null);
        localStorage.removeItem('userRole');
      }
    };

    fetchUser();
  }, []);


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
        <Link to="/movies" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Movies</Link>
        {userRole === 'Admin' && (
          <Link to="/adminmovies" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
            Manage Movies
          </Link>
        )}
        <br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br />
        <Link to="/privacy" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
        
        <Logout
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0
          }}
        >
          Log out
        </Logout>      
        </nav>
    </div>
  );
};

export default NavDrawer;
