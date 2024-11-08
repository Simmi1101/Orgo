import React, { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";

const Contacts = ({ contacts, currentUser, changeChat, sidebar }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <div
      className={`absolute md:relative inset-0 bg-[#001845] h-screen w-full md:w-72 transition-transform transform ${
        sidebar ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}
    >
      <div className="flex bg-[#001233] items-center gap-4 justify-center p-4 h-[4.5rem]">
        <h3 className="text-white uppercase">Contacts</h3>
      </div>
      <div className="flex-grow flex flex-col items-center overflow-auto gap-3 p-2">
        {contacts.users?.map((contact, index) => (
          <div
            key={contact._id}
            className={`flex items-center gap-4 p-2 min-h-[4rem] w-[90%] rounded-xl cursor-pointer transition-all duration-500 ease-in-out bg-[#33415c] shadow-lg ${
              index === currentSelected ? 'bg-[#0466c8]' : ''
            }`}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <div>
              {contact.profilePicture ? (
                <img src={contact.profilePicture} alt="profile" className="h-12 max-w-full" />
              ) : (
                <CgProfile color="white" fontSize="2rem" />
              )}
            </div>
            <div className="text-white">
              <h4>{contact.username}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="flex bg-[#001233] items-center justify-center gap-8 py-2 h-24">
        <div className="text-white">
          <h2>{currentUserName}</h2>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
