import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { allUsersRoute, host } from '../utilis/APIRoutes';
import Welcome from '../components/Welcome';
import { io } from 'socket.io-client';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';
import { GiHamburgerMenu } from 'react-icons/gi';

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login');
      } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(response.data);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setSidebar(false); // Close sidebar when a chat is selected on mobile
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#33415c]">
      <div className="flex h-full w-full">
        <div className={`flex flex-col ${sidebar ? 'block' : 'hidden'} md:block md:w-72`}>
          <Contacts
            sidebar={sidebar}
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
        </div>
        
          <GiHamburgerMenu
            onClick={() => setSidebar(!sidebar)}
            className="text-white text-3xl cursor-pointer p-2 md:hidden"
          />
       
          {currentChat === undefined ? (
            <div className="flex flex-col justify-center items-center h-full w-full text-white">
              <h1>Welcome, <span className="text-3xl text-orange-800">{currentUser?.username}</span></h1>
              <h3>Please select a chat to start messaging</h3>
            </div>
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
              className="flex-1"
            />
          )}
        
      </div>
    </div>
  );
}

export default Chat;
