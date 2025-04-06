import './App.css';
import { CartProvider } from './context/cartContext';
import AdminProjectsPage from './pages/AdminProjectsPage';
import CartPage from './pages/CartPage';
import DonatePage from './pages/DonatePage';
import ProjectsPage from './pages/ProjectsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CookieConsent from 'react-cookie-consent';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route
              path="/donate/:projectName/:projectId"
              element={<DonatePage />}
            />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminprojects" element={<AdminProjectsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
      </CartProvider>
    </>
  );
}

export default App;
