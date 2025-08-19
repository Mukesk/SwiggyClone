import React, { useState } from "react";
import "./login.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: async ({ username, password }) =>
      axios.post(
        `${baseUrl}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      console.log("Login success");
      navigate("/"); // redirect to home page
    },
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(data);
  };

  return (
    <div className="main flex justify-center items-center h-screen bg-gray-200">
      <div className="container rounded bg-black w-1/4 p-6 text-white">
        <div className="text-center text-3xl font-bold mb-2">LOGIN</div>
        <hr className="mb-4 border-gray-500" />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={handleChange}
              name="username"
              value={data.username}
              placeholder="Username"
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={data.password}
              placeholder="Password"
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-400 text-sm mt-2">
              {error?.response?.data?.message || "Login failed. Try again."}
            </p>
          )}

          <p className="text-center mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-400 underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
