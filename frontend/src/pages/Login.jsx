import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { loginRoute } from '../utilis/APIRoutes';

function Login() {

    const navigate = useNavigate()
    const [values, setValues] = useState({
      username:"",
      password:"", 
    })

    const toastOptions = {
      position:"top-right",
      pauseOnHover:"true",
      draggable: "true",
      theme:"light"
    }

    useEffect(() =>{
      if(localStorage.getItem("chat-app-user")){
        navigate("/")
      }
    },[])
    const handleSubmit = async(event) => {
      event.preventDefault();
      if(handleValidation()){
        const {username, password} = values
        console.log("values", values);
        console.log("in validation", loginRoute);
        try {
          const {data} = await axios.post(loginRoute,{
            username,
            password
          })
          if(data.status === 400){
            toast.error(data.msg, toastOptions)
          }
          if(data.status === 200){
            // console.log("inside this condition")
            localStorage.setItem("chat-app-user", JSON.stringify(data.data))
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            if(user.role==="user"){
              navigate("/")
            }else if(user.role==="admin"){
              navigate("/admin-panel")
            }
            
          }
          console.log("data", data);
        } catch (error) {
          toast.error("An error occurred. Please try again.", toastOptions);
          console.log("error", error);
        }   
      }
    }
  


    const handleValidation = () => {
      const {username, password} = values;

      if(password===""){
        toast.error("Password is required",toastOptions);
        return false
      }else if(username.length===""){
        toast.error("Username is required",toastOptions);
        return false
      }
      return true
    }
    const handleChange = (event) => {
        setValues({...values,[event.target.name]:event.target.value});
        
    }

  return (
  <>
  <div className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
    <div className="flex w-[30rem] flex-col space-y-10">
        <div className="text-center text-4xl font-medium">Log In</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
          </div>
            <button
              type="submit"
              className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400">LOG IN</button>
        </form>
    </div>
</div>
<ToastContainer />
</>
)
}



export default Login
