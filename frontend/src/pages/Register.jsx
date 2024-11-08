import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utilis/APIRoutes';

function Register() {
    const navigate= useNavigate()
    const [values, setValues] = useState({
      username:"",
      email:"",
      role:"",
      password:"",
      confirmPassword:""
    })

    const toastOptions = {
      position:"top-right",
      pauseOnHover:"true",
      draggale: "true",
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
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
            <div className='brand'>
                <img src=''></img>
                <h1>Chat App</h1>
            </div>
                <input type='text' placeholder='Username' name='username' onChange={(e)=>handleChange(e)}/>
                <input type='email' placeholder='Email' name='email' onChange={(e)=>handleChange(e)}/>
                <input type='text' placeholder='Enter role' name='role' onChange={(e)=>handleChange(e)}/>
                <input type='password' placeholder='Password' name='password' onChange={(e)=>handleChange(e)}/>
                <input type='passowrd' placeholder='Confirm Password' name='confirmPassword' onChange={(e)=>handleChange(e)}/>
                <button type='submit'>Create User</button>
        </form>
      </FormContainer>
    <ToastContainer/>
    </>
  )
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 6rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #013a63;
    border-radius: 0.4rem;
    color: white;
    width: 400px;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #2a6f97;
      outline: none;
    }
  }
  button {
    background-color: #01497c;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`
    

export default Register
