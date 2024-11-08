import React from 'react';

const Welcome = ({ currentUser }) => {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center text-white bg-indigo-950'>
      <h1 className='text-4xl md:text-5xl font-bold'>
        Welcome, <span className='text-red-600'>{currentUser?.username}</span>
      </h1>
      <h3 className='mt-4 text-xl md:text-2xl text-center'>
        Please select a chat to start messaging
      </h3>
    </div>
  );
};

export default Welcome;
