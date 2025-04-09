import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CookieConsent from 'react-cookie-consent';
import MoviesPage from './pages/MoviesPage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('authToken')
  );
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://localhost:5000/pingauth', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          const role =
            data.roles && data.roles.length > 0 ? data.roles[0] : 'Customer';
          setUserRole(role);
          localStorage.setItem('authToken', 'true');
          localStorage.setItem('userRole', role);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
      }
    };

    // Initial load
    setTimeout(fetchUser, 300);

    const handleStorageChange = () => {
      const auth = !!localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(auth);
      setUserRole(role);
      // Re-check from server to confirm
      setTimeout(fetchUser, 300);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route
            path="/adminmovies"
            element={
              isAuthenticated && userRole === 'Admin' ? (
                <AdminMoviesPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/details" element={<MovieDetailPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>

        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="cookieConsent"
          style={{
            background: '#1e1e1e',
            color: '#ffffff',
            fontSize: '16px',
            padding: '20px',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
          }}
          buttonStyle={{
            backgroundColor: '#6f5df5',
            color: '#000',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
          enableDeclineButton
          declineButtonText="Decline"
          declineButtonStyle={{
            backgroundColor: '#bbb',
            color: '#000',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          expires={365}
        >
          We use cookies to ensure you get the best experience on our website.
        </CookieConsent>
      </Router>
    </>
  );
}

export default App;
