import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import "./login.css"
import axios from 'axios'   
import baseUrl from '../constant/baseUrl'

const Signup = () => {
    const [data, setData] = useState({
        username: "",
        fullname: "",
        password: "",
        city:"",
        pincode:"",
        phoneno:"",
        
    
    })
    const { mutate, isPending, error, isError, isSuccess } = useMutation({
        mutationFn: async ({ username, fullname, password, city, pincode, phoneno }) => {
          const res = await axios.post(`${baseUrl}/api/auth/signup`, { username, fullname, password, city, pincode, phoneno }, {
            headers: {  "Content-Type": "application/json", "Accept": "application/json" },
            withCredentials: true,
            
          })
            return res.data;
        },
        
             onSuccess: () => {
            console.log("success")
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
    <div className='signup main flex justify-center  items-center bg-gray-200'>
      <div className=" container  rounded bg-black w-1/4 p-4  rounded-lg">
        <div className="form-container">
          <form action="">
            <h1>Sign Up</h1>
            <hr></hr>
          <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={handleChange}
              name="username"
              placeholder="Username"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
            <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              onChange={handleChange}
              name="fullname"
              placeholder="Full Name"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
            <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={handleChange}
              name="password"
              placeholder="Password"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
            <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              onChange={handleChange}
              name="city"
              placeholder="City"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
          <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              onChange={handleChange}
              name="pincode"
              placeholder="Pincode"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
            <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="phoneno">Phone No</label>
            <input
              type="text"
              id="phoneno"
              onChange={handleChange}
              name="phoneno"
              placeholder="Phone No"
              required
              className="w-full  p-2 mb-4 border rounded"
            />
          </div>
          
        
         
            <button  className="w-1/4 bg-blue-500 text-white p-1 rounded align-self-center"onClick={handleSubmit}>Sign Up</button>
          </form>
        </div>
      </div>
      
    </div>
  )
}

export default Signup
