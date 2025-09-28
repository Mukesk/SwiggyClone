import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Signup from './pages/signup'
import Cart from './pages/cart'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import baseUrl from './constant/baseUrl'
import axios from 'axios'
import PaymentSuccess from './pages/paymentsuccess'
import PaymentFailed from './pages/paymentfailed'
import LoadingSpinner from './components/LoadingSpinner'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import { useState, useEffect } from 'react'
function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 5000 // 5 second timeout
        });
        console.log('Authentication successful:', res.data);
        setUserData(res.data);
      } catch (error) {
        console.log('Authentication failed or skipped:', error.message);
        setUserData(null);
      } finally {
        setAuthChecked(true);
      }
    };

    // Add a minimum loading time to prevent flashing
    setTimeout(() => {
      checkAuth();
    }, 1000);
  }, []);

  if (!authChecked) {
    return <LoadingSpinner message="Loading BiteMe..." />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Home Route (accessible to all with dynamic features based on auth) */}
          <Route path="/" element={<Home />} />

          {/* Auth Routes (accessible only when not logged in) */}
          <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Cart Route */}
          <Route path="/cart" element={userData ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/success" element={<PaymentSuccess/>}/>
          <Route path="/failed" element={<PaymentFailed/>}/>
          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{
            top: 80, // Account for navbar height
          }}
          toastOptions={{
            duration: 2500,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: '#10B981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
