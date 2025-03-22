
import './App.css'
import { NavbarMenu } from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Products from './pages/Products'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

function App() {

  const { isAuthenticated, user } = useAuth0();
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const authUserId = `user_${user?.sub?.split('|')[1] || Math.random().toString(36).substring(2, 10)}`;
      setUserId(authUserId);
    } else {
      // Check localStorage as fallback
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, [isAuthenticated, user]);
  return (
    <>
    
      <BrowserRouter>
      
      <NavbarMenu />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={ <Products userId={userId} />} />
        </Routes>
      
      
      </BrowserRouter>
    </>
  )
}

export default App
