import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <>
        <h2>Welcome to the home page shawty</h2>
        <button onClick={() => navigate('/login')}> Sign In</button>
        <button onClick={() => navigate('/register')}>Sign Up</button>
        </>
    );
};

export default HomePage;