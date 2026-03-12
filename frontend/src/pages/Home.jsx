import React from 'react';
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';

const Home = () => {
  return (
    <div className='flex w-full h-screen bg-[#1e1a2d] overflow-hidden'>
      <SideBar />
      <ChatContainer />
    </div>
  );
};

export default Home;
