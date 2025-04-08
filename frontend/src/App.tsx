import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CookieConsent from 'react-cookie-consent';
import MoviesPage from './pages/MoviesPage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/adminmovies" element={<AdminMoviesPage />} />
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
          style={{ background: '#2B373B' }}
          buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
          expires={365}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      </Router>
    </>
  );
}

export default App;
