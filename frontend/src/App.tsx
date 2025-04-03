import './App.css'
import { CartProvider } from './context/cartContext'
import AdminProjectsPage from './pages/AdminProjectsPage'
import CartPage from './pages/CartPage'
import DonatePage from './pages/DonatePage'
import ProjectsPage from './pages/ProjectsPage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  return (
    <>
    <CartProvider>
        <Router>
          <Routes>
            <Route path='/' element={<ProjectsPage/>}/>
            <Route path='/donate/:projectName/:projectId' element={<DonatePage/>}/>
            <Route path='/projects' element={<ProjectsPage/>}/>
            <Route path='/cart' element={<CartPage/>}/>
            <Route path='/adminprojects' element={<AdminProjectsPage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App
