import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utilis/APIRoutes';
import { IoChevronBackSharp } from "react-icons/io5";
import ErrorRoute from './ErrorRoute';

const GetAllUsers = () => {
    const navigate = useNavigate();
    const [AllUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [role, setRole] = useState(undefined);

    const tableHead = [
        "Index", "User Name", "Email", "Role"
    ];

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            } else {
                const user = await JSON.parse(localStorage.getItem("chat-app-user"));
                setCurrentUser(user);
                setRole(user.role);
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser) {
                try {
                    const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setAllUsers(response.data.users);
                } catch (error) {
                    console.error("Error fetching contacts:", error);
                }
            }
        };
        fetchContacts();
    }, [currentUser]);

    const ClickArrow = () => {
        navigate("/admin-panel");
    };

    return (
        <>
            {role === "admin" ? (
                <div className="min-h-screen bg-gray-900 text-white">
                  <div className="relative bg-gray-800 p-4">
                        <button 
                            className='absolute top-4 left-4 p-2 bg-none rounded-full'
                            onClick={() => ClickArrow()}
                        >
                            <IoChevronBackSharp size={"2rem"} />
                        </button>
                        <h1 className="text-2xl text-center text-gray-200">All Users</h1>
                    </div>
                    <div className="p-4 h-screen bg-gray-900 overflow-auto">
                        <table className="min-w-full bg-gray-800 text-gray-300">
                            <thead className="sticky top-0 bg-gray-900 text-gray-300">
                                <tr>
                                    {tableHead.map((heading, index) => (
                                        <th key={index} className="px-4 py-2 text-left border-b border-gray-600">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {AllUsers?.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-700">
                                        <td className="px-4 py-2 border-b border-gray-600">{index + 1}</td>
                                        <td className="px-4 py-2 border-b border-gray-600">{user.username}</td>
                                        <td className="px-4 py-2 border-b border-gray-600">{user.email}</td>
                                        <td className="px-4 py-2 border-b border-gray-600">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <ErrorRoute />
            )}
        </>
    );
};

export default GetAllUsers;
