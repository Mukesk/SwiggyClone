import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from './baseUrl';

const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient()  

  const changeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const { mutate, data, isLoading, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
    
        const res = await axios.post(`${baseUrl}/api/auth/login`, 
          { username, password },  
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            withCredentials: true, // Move this outside headers
          }
        );
        return res.data;
     
    },
    onSuccess: () => {
      console.log("Login successful");
      queryClient.invalidateQueries(["userData"]);
    },
  });

  const onSubmit = () => {
    mutate(userData);
  };

  return (
    <div className="container flex flex-col space-y-4 p-4">
      <div className="text-3xl font-bold">Login</div>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        onChange={changeHandler}
        className="border border-gray-900 p-2 rounded"
        name="username"
        type="text"
        placeholder="Enter username"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        onChange={changeHandler}
        className="border border-gray-900 p-2 rounded"
        name="password"
        type="password"
        placeholder="Enter password"
        value={userData.password}
      />

      <button
        className="border bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        type="button"
        onClick={onSubmit}
      >
        Login
      </button>

      {isLoading && <p className="text-yellow-500">Loading...</p>}
      {isError && <p className="text-red-500">Error: {error?.message || "Something went wrong"}</p>}
      {data && <p className="text-green-500">Login Successful</p>}
    </div>
  );
};

export default Login;
