import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utilis/APIRoutes';
import { IoChevronBackSharp } from "react-icons/io5";

function CreateUser() {
    const navigate= useNavigate();
    
    const [values, setValues] = useState({
      username:"",
      email:"",
      role:"",
      password:"",
      confirmPassword:"",
    })

    const toastOptions = {
      position:"top-right",
      pauseOnHover:"true",
      draggale: "true",
      theme:"light"
    }

    const ClickArrow = () => {
      navigate("/admin-panel")
    }
    // useEffect(() =>{
    //   if(localStorage.getItem("chat-app-user")){
    //     navigate("/")
    //   }
    // },[])
    const handleSubmit = async(event) => {
      event.preventDefault();
      if(handleValidation()){
        // console.log("in validation", registerRoute);
        try {
        const {password, username, email, role} = values
        const {data} = await axios.post(registerRoute,{
          username,
          email,
          role,
          password
        })
        console.log("data", data);
        if(data.status === 400){
          toast.error(data.msg, toastOptions)
        }
        if(data.status === 200){
          console.log("data",data)
          localStorage.setItem("chat-app-user", JSON.stringify(data.data))
          navigate("/")
        }
        } catch (error) {
          toast.error("An error occurred. Please try again.", toastOptions);
          console.log("error", error);
        }
        
        
      }
    }

    const handleValidation = () => {
      const {password, confirmPassword, username, role, email} = values;

      if(password!==confirmPassword){
        console.log("error");
        toast.error("Password and Confirm Password is not same",toastOptions);
        return false
      }else if(username.length<3){
        toast.error("Username should be greater than 3 characters",toastOptions);
        return false
      }else if(password.length<8){
        toast.error("Password should be equal to or greater than 8 characters",toastOptions);
        return false
      }else if(email===""){
        toast.error("Email is required",toastOptions)
        return false
      }else if(role===""){
        toast.error("Enter the role",toastOptions)
        return false
      }

      return true
    }
    const handleChange = (event) => {
        setValues({...values,[event.target.name]:event.target.value});
        
    }

  return (
    <>
      <div className='mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white'>
        <button className='absolute top-4 left-4 p-2 bg-none rounded-full'onClick={()=>ClickArrow()}><IoChevronBackSharp size={"2rem"} /></button>
        <div className='flex w-[30rem] flex-col space-y-10'>
        <div className="text-center text-4xl font-medium">Create New User</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e)=>handleChange(e)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input 
            type='email' 
            placeholder='Email' 
            name='email' 
            onChange={(e)=>handleChange(e)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input 
            type='text' 
            placeholder='Enter role' 
            name='role' 
            onChange={(e)=>handleChange(e)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e)=>handleChange(e)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input 
            type='passowrd' 
            placeholder='Confirm Password' 
            name='confirmPassword' 
            onChange={(e)=>handleChange(e)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>
            <button
              type="submit"
              className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400">Create User</button>
        </form>
        </div>
      </div>
    <ToastContainer/>
    </>
  )
}

export default CreateUser
