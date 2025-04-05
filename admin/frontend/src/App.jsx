import { useQuery } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import baseUrl from './pages/baseUrl';

function App() {
  const { data: authResponse, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/auth/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data; // Expected { success: "Authentication complete" }
    },
  });

  // Check if the user is authenticated
  const isAuthenticated = authResponse?.success === "Authentication complete";

  return (
    <BrowserRouter>
      <Routes>
        {isLoading ? (
          <Route path="*" element={<p>Loading...</p>} />
        ) : isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
