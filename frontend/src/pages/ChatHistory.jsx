import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllMessageHistory } from '../utilis/APIRoutes';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackSharp } from "react-icons/io5";
import ErrorRoute from './ErrorRoute';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import chevronDown from "./chevron-down.svg";
import { FaRegFilePdf } from "react-icons/fa6";

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <img className="w-4 h-4 ml-2" src={chevronDown} alt="Chevron Down" />
      </>
    }
    className="bg-white"
    buttonProps={{
      className: ({ isEnter }) =>
        `py-2 px-4 flex items-center justify-between w-full text-left border-b border-gray-200 ${isEnter ? 'bg-gray-200' : 'bg-white'}`
    }}
    contentProps={{ className: 'p-4' }}
    panelProps={{ className: 'bg-gray-100' }}
  />
);

const ChatHistory = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [role, setRole] = useState(undefined);

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
    const fetchAllMsgs = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`${getAllMessageHistory}`);
          setMessages(response?.data.data);
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    fetchAllMsgs();
  }, [currentUser]);

  const ClickArrow = () => {
    navigate("/admin-panel");
  };

  const tableHead = [
    "Index",
    "Sender",
    "Receiver",
    "Message Content",
    "Date",
    "Time"
  ];

  const senders = [];
  const groupBySender = messages.reduce((acc, msg) => {
    (acc[msg.sender] = acc[msg.sender] || []).push(msg);
    return acc;
  }, senders);

  return (
    <>
      {role === "admin" ? (
        <div className="min-h-screen bg-gray-900 text-white p-4">
          <div className="relative bg-gray-800 p-4 mb-4">
              <button 
                className='absolute top-4 left-4 p-2 mb-2 bg-none rounded-full'
                  onClick={() => ClickArrow()}
              >
                <IoChevronBackSharp size={"2rem"} />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-200 text-center flex-1">Chat History of All Users</h1>
          </div>
          <div className="overflow-auto bg-gray-900">
            {Object.keys(senders).map(user => (
              <Accordion key={user} className="">
                <AccordionItem
                  header={`Chat History of user ${user}`}
                >
                  <div className="overflow-x-auto bg-yellow p-4">
                    <table className="min-w-full bg-gray-800 text-gray-300 border-collapse">
                      <thead className="sticky top-0 bg-gray-900 text-gray-300">
                        <tr>
                          {tableHead.map((heading, index) => (
                            <th
                              key={index}
                              className="px-2 py-1 md:px-4 md:py-2 text-left border-b border-gray-600"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {senders[user].map((message, index) => (
                          <tr key={message._id} className="hover:bg-gray-700">
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">{index + 1}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">{message.sender}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">{message.users[1]}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">
                              {message.message.text && message.message.text.startsWith('http') ? (
                                message.message.text.endsWith('jpg') || message.message.text.endsWith('png') ? (
                                  <img src={message.message.text} alt="File content" className="w-12 h-12" />
                                ) : message.message.text.endsWith('pdf') ? (
                                  <div
                                    onClick={() => { window.open(message.message.text); }}
                                    className="flex items-center gap-2 text-blue-500 cursor-pointer"
                                  >
                                    <FaRegFilePdf size="1.5em" />
                                    <p>PDF file</p>
                                  </div>
                                ) : null
                              ) : (
                                <p>{message.message.text}</p>
                              )}
                            </td>
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">{new Date(message.createdAt).toLocaleDateString()}</td>
                            <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-600">{new Date(message.createdAt).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      ) : (
        <ErrorRoute />
      )}
    </>
  );
};

export default ChatHistory;
