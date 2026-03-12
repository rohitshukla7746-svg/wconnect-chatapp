import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from "react-toastify";

// SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const VerifyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const HashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const OnlineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SideBar = () => {
  const navigate = useNavigate();
  const {
    userData, backendUrl, setUserData, setIsLoggedin,
    rooms, setRooms, getRooms,
    selectedRoom, setSelectedRoom,
    selectedUser, setSelectedUser,
    onlineUsers, activeTab, setActiveTab,
    allUsers, getAllUsers,
  } = useContext(AppContent);

  const [search, setSearch] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: "", password: "", hasPassword: false });
  const [joinPassword, setJoinPassword] = useState("");

  // Refresh users list every time DMs tab is opened
  useEffect(() => {
    if (activeTab === "dms") getAllUsers();
  }, [activeTab]);

  const sendVerificationOtp = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {}, { withCredentials: true });
      if (response.data.success) {
        navigate('/email-verify');
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name.trim()) return toast.error("Room name is required");
    try {
      const res = await axios.post(`${backendUrl}/api/rooms/create`, {
        name: newRoom.name,
        password: newRoom.password,
        has_password: newRoom.hasPassword,
      });
      if (res.data.success) {
        toast.success("Room created!");
        getRooms();
        setSelectedRoom(res.data.room);
        setShowCreateRoom(false);
        setNewRoom({ name: "", password: "", hasPassword: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = async (room) => {
    try {
      const res = await axios.post(`${backendUrl}/api/rooms/join`, {
        roomId: room.id,
        password: joinPassword,
      });
      if (res.data.success) {
        toast.success("Joined room!");
        setSelectedRoom(room);
        setShowJoinRoom(null);
        setJoinPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
    }
  };

  const handleSelectRoom = (room) => {
    if (room.has_password) {
      setShowJoinRoom(room);
    } else {
      setSelectedRoom(room);
      setSelectedUser(null);
    }
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className={`flex flex-col h-screen bg-[#1e1a2d] w-full md:w-64 lg:w-80 border-r border-gray-700 transition-all duration-300 ${selectedRoom || selectedUser ? "max-md:hidden" : "block"}`}>

        {/* Header */}
        <div className='p-5 pb-2'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-white font-bold text-xl'>Wconnect</h2>
            <div className='relative group py-2'>
              <div className='text-gray-400 hover:text-white cursor-pointer transition-colors px-2'>
                <DotsIcon />
              </div>
              <div className='absolute top-full right-0 z-50 w-44 pt-2 hidden group-hover:block'>
                <div className='bg-[#282140] border border-gray-600 rounded-lg shadow-2xl overflow-hidden'>
                  <p onClick={() => navigate('/profile')} className='px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-gray-100 flex items-center gap-2'>
                    <UserIcon /> Edit profile
                  </p>
                  {userData && !userData.is_account_verified && (
                    <>
                      <hr className='border-gray-600' />
                      <p onClick={sendVerificationOtp} className='px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-blue-400 flex items-center gap-2'>
                        <VerifyIcon /> Verify email
                      </p>
                    </>
                  )}
                  <hr className='border-gray-600' />
                  <p onClick={logout} className='px-4 py-3 hover:bg-red-500/20 cursor-pointer text-sm text-red-400 flex items-center gap-2'>
                    <LogoutIcon /> Logout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex gap-1 mb-4 bg-[#282142] rounded-xl p-1'>
            {["rooms", "dms", "online"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab === "rooms" ? <><HashIcon /> Rooms</> : tab === "dms" ? <><MessageIcon /> DMs</> : <><OnlineIcon /> Online</>}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className='bg-[#282142] rounded-full flex items-center gap-3 py-2.5 px-4 mb-3 ring-1 ring-transparent focus-within:ring-gray-500 transition-all'>
            <span className="text-gray-400"><SearchIcon /></span>
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 flex-1'
              placeholder='Search...'
            />
          </div>

          {/* Create Room Button */}
          {activeTab === "rooms" && (
            <button
              onClick={() => setShowCreateRoom(true)}
              className='w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl flex items-center justify-between py-3 px-4 text-white group'
            >
              <span className='text-sm font-medium'>Create channel</span>
              <PlusIcon />
            </button>
          )}
        </div>

        <hr className='mx-5 border-gray-700/50 mt-2' />

        {/* List */}
        <div className='flex-1 overflow-y-auto px-2 mt-2 custom-scrollbar'>

          {/* Rooms */}
          {activeTab === "rooms" && (
            filteredRooms.length === 0
              ? <div className='p-4 text-center text-gray-500 text-xs italic'>No rooms yet</div>
              : filteredRooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer mb-1 transition-all ${selectedRoom?.id === room.id ? "bg-indigo-600/20 border border-indigo-500/30" : "hover:bg-white/5"}`}
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-gray-500'><HashIcon /></span>
                    <div>
                      <p className={`text-sm font-medium ${selectedRoom?.id === room.id ? "text-indigo-300" : "text-gray-200"}`}>{room.name}</p>
                      <p className='text-xs text-gray-500'>{room.member_count} members</p>
                    </div>
                  </div>
                  {room.has_password && <span className='text-gray-500'><LockIcon /></span>}
                </div>
              ))
          )}

          {/* DMs */}
          {activeTab === "dms" && (
            allUsers.length === 0
              ? <div className='p-4 text-center text-gray-500 text-xs italic'>No users found</div>
              : allUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(user => (
                <div
                  key={user.id}
                  onClick={() => { setSelectedUser(user); setSelectedRoom(null); }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer mb-1 transition-all ${selectedUser?.id === user.id ? "bg-indigo-600/20 border border-indigo-500/30" : "hover:bg-white/5"}`}
                >
                  <div className='relative'>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-full object-cover' />
                    ) : (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold'>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1a2d] rounded-full' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className={`text-sm font-medium truncate ${selectedUser?.id === user.id ? "text-indigo-300" : "text-gray-200"}`}>{user.name}</p>
                    {user.bio && <p className='text-xs text-gray-500 truncate'>{user.bio}</p>}
                  </div>
                </div>
              ))
          )}

          {/* Online Users */}
          {activeTab === "online" && (
            onlineUsers.length === 0
              ? <div className='p-4 text-center text-gray-500 text-xs italic'>No users online</div>
              : onlineUsers.map((user, i) => (
                <div key={i} className='flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 cursor-pointer mb-1'>
                  <div className='relative'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold'>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1a2d] rounded-full' />
                  </div>
                  <span className='text-sm text-gray-300'>{user.username}</span>
                </div>
              ))
          )}
        </div>

        {/* User Info Bottom */}
        <div className='p-4 border-t border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all' onClick={() => navigate('/profile')}>
          <div className='relative flex-shrink-0'>
            {userData?.avatar ? (
              <img src={userData.avatar} alt="avatar" className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/40' />
            ) : (
              <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold'>
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1a2d] rounded-full' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-white text-sm font-medium truncate'>{userData?.name}</p>
            <p className='text-green-400 text-xs'>Online</p>
          </div>
          <span className='text-gray-500'><SettingsIcon /></span>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
          <div className='bg-[#1e1a2d] border border-gray-700 rounded-2xl p-6 w-80 shadow-2xl'>
            <h3 className='text-white font-bold text-lg mb-4'>Create Channel</h3>
            <input
              placeholder='Channel name'
              value={newRoom.name}
              onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
              className='w-full bg-[#282142] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 mb-3'
            />
            <label className='flex items-center gap-2 mb-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={newRoom.hasPassword}
                onChange={e => setNewRoom({ ...newRoom, hasPassword: e.target.checked })}
                className='accent-indigo-500'
              />
              <span className='text-gray-400 text-sm flex items-center gap-1'><LockIcon /> Password protected</span>
            </label>
            {newRoom.hasPassword && (
              <input
                placeholder='Room password'
                type='password'
                value={newRoom.password}
                onChange={e => setNewRoom({ ...newRoom, password: e.target.value })}
                className='w-full bg-[#282142] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 mb-3'
              />
            )}
            <div className='flex gap-3 mt-2'>
              <button onClick={() => setShowCreateRoom(false)} className='flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 text-sm hover:bg-white/5'>Cancel</button>
              <button onClick={handleCreateRoom} className='flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium'>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinRoom && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
          <div className='bg-[#1e1a2d] border border-gray-700 rounded-2xl p-6 w-80 shadow-2xl'>
            <h3 className='text-white font-bold text-lg mb-1'>Join #{showJoinRoom.name}</h3>
            <p className='text-gray-500 text-sm mb-4'>This channel is password protected</p>
            <input
              placeholder='Enter room password'
              type='password'
              value={joinPassword}
              onChange={e => setJoinPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoinRoom(showJoinRoom)}
              className='w-full bg-[#282142] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 mb-4'
            />
            <div className='flex gap-3'>
              <button onClick={() => { setShowJoinRoom(null); setJoinPassword(""); }} className='flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 text-sm hover:bg-white/5'>Cancel</button>
              <button onClick={() => handleJoinRoom(showJoinRoom)} className='flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2'>
                <LockIcon /> Join
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
