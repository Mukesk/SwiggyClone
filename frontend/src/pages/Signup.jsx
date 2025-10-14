import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import "./login.css"
import axios from 'axios'   
import baseUrl from '../constant/baseUrl'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiMail, FiMapPin, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { BiLoaderAlt } from 'react-icons/bi'
import toast from 'react-hot-toast'

const Signup = () => {
    const [data, setData] = useState({
        username: "",
        fullname: "",
        password: "",
        city:"",
        pincode:"",
        phoneno:"",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { mutate, isPending, error, isError, isSuccess } = useMutation({
        mutationFn: async ({ username, fullname, password, city, pincode, phoneno }) => {
          const res = await axios.post(`${baseUrl}/api/auth/signup`, { username, fullname, password, city, pincode, phoneno }, {
            headers: {  "Content-Type": "application/json", "Accept": "application/json" },
            withCredentials: true,
            
          })
            return res.data;
        },
        
        onSuccess: () => {
            toast.success("Account created successfully! Welcome to BiteMe!", {
                duration: 3000,
                position: 'top-center',
            })
            setTimeout(() => navigate('/'), 1500)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create account. Please try again.", {
                duration: 3000,
                position: 'top-center',
            })
        }
        }
    )
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
         mutate(data)
        console.log(data);
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mb-4">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join BiteMe!</h1>
            <p className="text-gray-600">Create your account to start ordering delicious food</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={data.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={data.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={data.pincode}
                    onChange={handleChange}
                    placeholder="Area pincode"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="phoneno" className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneno"
                    name="phoneno"
                    value={data.phoneno}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Sign Up button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mt-8"
            >
              {isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <BiLoaderAlt className="animate-spin h-5 w-5" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
        {/* Bottom text */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Join thousands of food lovers on BiteMe
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
