import React from 'react';
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import VideoCall from "../components/VideoCall";

const Home = () => {
  return (
    <div className='flex w-full h-screen bg-[#1e293b] overflow-hidden'>
      <SideBar />
      <ChatContainer />
      <VideoCall />
    </div>
  );
};

export default Home;