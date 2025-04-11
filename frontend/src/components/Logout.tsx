import { useNavigate } from 'react-router-dom';
import { baseURL } from '../api/MoviesAPI';

function Logout(props: { children: React.ReactNode,  style?: React.CSSProperties; }) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        alert('You have been logged out.');
        navigate('/');
        window.location.reload(); // Ensure React state resets
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button type="button" onClick={handleLogout} style={props.style}>
      {props.children}
    </button>
  );
}

export default Logout;
