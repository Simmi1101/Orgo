import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import ErrorRoute from './ErrorRoute';

const Admin = () => {

  const [role, setRole] = useState(undefined)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        // console.log("user", user);
        // console.log("user", user.role);
        setRole(user.role);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  
  
  const handleCreateUser = () =>{
    navigate("/create-user")
  }
  const handleListUsers = () =>{
    navigate("/get-all-users")
  }

  const handleGetChatHistory = () => {
    navigate("/get-chat-history")
  }
  const handleChat = () =>{
    navigate("/")
  }

  return (
    <>
            {role === "admin" ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 gap-4">
                    <Logout className="self-start" />
                    <div className="text-white text-3xl font-bold mb-4">Admin Panel</div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleCreateUser}
                            className="bg-[#01497c] text-white py-2 px-4 rounded-lg font-bold uppercase text-sm hover:bg-[#4e0eff] transition-colors"
                        >
                            Create User
                        </button>
                        <button 
                            onClick={handleListUsers}
                            className="bg-[#01497c] text-white py-2 px-4 rounded-lg font-bold uppercase text-sm hover:bg-[#4e0eff] transition-colors"
                        >
                            List Users
                        </button>
                        <button 
                            onClick={handleChat}
                            className="bg-[#01497c] text-white py-2 px-4 rounded-lg font-bold uppercase text-sm hover:bg-[#4e0eff] transition-colors"
                        >
                            Start Chat
                        </button>
                        <button 
                            onClick={handleGetChatHistory}
                            className="bg-[#01497c] text-white py-2 px-4 rounded-lg font-bold uppercase text-sm hover:bg-[#4e0eff] transition-colors"
                        >
                            Chat History
                        </button>
                    </div>
                </div>
            ) : (
                <ErrorRoute />
            )}
        </>
  )
}

export default Admin
