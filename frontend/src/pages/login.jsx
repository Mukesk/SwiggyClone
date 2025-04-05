import React from 'react'   
import "./login.css"
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import baseUrl from '../constant/baseUrl'
import {useState} from 'react'


const Login = () => {
    const [data,setData]=useState({
        username:"",
        password:""
    })
    const {mutate,isPending,error,isError,isSuccess}=useMutation({
        mutationFn:async({username,password})=>axios.post(`${baseUrl}/api/auth/login`,{username,password},{headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },withCredentials:true}),onSuccess:()=>{
            console.log("success")
        }
    })
    const handleChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value})

    }
    const handleSubmit=(e)=>{
        e.preventDefault()
       
        mutate(data)
    }
  return (
    <>
    <div className="main flex justify-center height-50vh items-center h-screen bg-gray-200">
        
       
       <div className="container  rounded bg-black w-1/4 p-4  rounded-lg">
       <div className='text-center text-3xl'>LOGIN</div>
       <hr></hr>
        <div className="mb-4 flex justify-center mt-4 flex-col  ">
            <label htmlFor="username">Username</label>
             <input type="text" id='username' onChange={handleChange} name='username' placeholder='Username'required className="w-full  p-2 mb-4 border rounded"/>
       </div>
         <div className="mb-4">
       <label htmlFor="password">Password</label> 
       <input type="password" id="password"name='password' onChange={handleChange} required placeholder='Password' className="w-full border rounded  p-2 mb-4"/>
         </div>
       <button className=" w-1/4 bg-blue-500 text-white p-1 rounded align-self-center" onClick={handleSubmit}>Login</button> 
       <p className="text-center mt-4">Don't have an account? <a path="/register" className="text-blue-500">Register</a></p>

 
        
       </div>
    </div>
        
      
    </>
  )
}

export default Login
