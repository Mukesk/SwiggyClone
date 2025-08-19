import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'


import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom' 

import { useQuery } from '@tanstack/react-query'
import baseUrl from './constant/baseUrl'
import axios from 'axios'
import { useEffect } from 'react'
function App() {
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/auth/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      console.log(res.data )
      return res.data
    },
    onSuccess: (data) => {
      console.log(data)
      console.log('User data fetched successfully')
    }
  })

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Home Route */}
        <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />

        {/* Public Routes (accessible only when not logged in) */}
        <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" />} />

        {/* Protected Cart Route */}
        <Route path="/cart" element={userData ? <Cart /> : <Navigate to="/login" />} />
<Route path="/success" element={<PaymentSuccess/>}/>
        <Route path="/failed" element={<PaymentFailed/>}/>
        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
