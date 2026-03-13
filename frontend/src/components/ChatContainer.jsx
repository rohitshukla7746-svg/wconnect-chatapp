// import React, { useContext, useRef, useEffect, useState } from 'react';
// import { AppContent } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// // SVG Icons
// const PhoneIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
//   </svg>
// );

// const VideoIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="23 7 16 12 23 17 23 7"/>
//     <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
//   </svg>
// );

// const AttachIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
//   </svg>
// );

// const SendIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="22" y1="2" x2="11" y2="13"/>
//     <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//   </svg>
// );

// const BackIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="15 18 9 12 15 6"/>
//   </svg>
// );

// const FileIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
//     <polyline points="14 2 14 8 20 8"/>
//   </svg>
// );

// const CloseIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18"/>
//     <line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// );

// const ChatIcon = () => (
//   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
//   </svg>
// );

// const WaveIcon = () => (
//   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M9 11l3 3L22 4"/>
//     <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
//   </svg>
// );

// const TrashIcon = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
//     <path d="M10 11v6M14 11v6"/>
//     <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
//   </svg>
// );

// const ChatContainer = () => {
//   const {
//     selectedRoom, setSelectedRoom,
//     selectedUser, setSelectedUser,
//     messages, setMessages,
//     dmMessages, setDmMessages,
//     sendMessage, sendDm,
//     userData, backendUrl, onlineUserIds,
//   } = useContext(AppContent);

//   const [input, setInput] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [hoveredMsg, setHoveredMsg] = useState(null);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const isRoom = !!selectedRoom;
//   const currentMessages = isRoom ? messages : dmMessages;
//   const currentTarget = isRoom ? selectedRoom : selectedUser;

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [currentMessages]);

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setSelectedFile(file);
//     if (file.type.startsWith("image/")) {
//       setFilePreview(URL.createObjectURL(file));
//     } else {
//       setFilePreview(null);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() && !selectedFile) return;

//     if (selectedFile) {
//       const fileMsg = selectedFile.type.startsWith("image/")
//         ? `[Image: ${selectedFile.name}]`
//         : `[File: ${selectedFile.name}]`;

//       if (isRoom) await sendMessage(selectedRoom.id, fileMsg);
//       else if (selectedUser) await sendDm(selectedUser.id, fileMsg);

//       setSelectedFile(null);
//       setFilePreview(null);
//       fileInputRef.current.value = "";
//     }

//     if (input.trim()) {
//       if (isRoom) await sendMessage(selectedRoom.id, input);
//       else if (selectedUser) await sendDm(selectedUser.id, input);
//       setInput("");
//     }
//   };

//   const handleDeleteMessage = async (msg) => {
//     try {
//       const endpoint = isRoom
//         ? `${backendUrl}/api/messages/message/${msg.id}`
//         : `${backendUrl}/api/messages/dm/${msg.id}`;
//       const res = await axios.delete(endpoint);
//       if (res.data.success) {
//         if (isRoom) {
//           setMessages(prev => prev.filter(m => m.id !== msg.id));
//         } else {
//           setDmMessages(prev => prev.filter(m => m.id !== msg.id));
//         }
//         toast.success("Message deleted");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete message");
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setFilePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // Empty state
//   if (!selectedRoom && !selectedUser) {
//     return (
//       <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#1e1a2d] text-gray-500">
//         <div className="bg-[#282142] p-6 rounded-full mb-4 shadow-xl text-indigo-400">
//           <ChatIcon />
//         </div>
//         <h2 className="text-xl font-semibold text-white">Your Messages</h2>
//         <p className="text-sm opacity-60">Select a room or user to start chatting</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col h-screen bg-[#1e1a2d]">

//       {/* Header */}
//       <div className="p-4 bg-[#282142] border-b border-gray-700 flex items-center justify-between shadow-md">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => { setSelectedRoom(null); setSelectedUser(null); }}
//             className="md:hidden text-gray-400 hover:text-white p-1"
//           >
//             <BackIcon />
//           </button>

//           <div className="relative">
//             {!isRoom && currentTarget?.avatar ? (
//               <img src={currentTarget.avatar} alt={currentTarget.name} className="w-10 h-10 rounded-full object-cover border border-gray-600" />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border border-gray-600">
//                 {isRoom ? "#" : currentTarget?.name?.[0]?.toUpperCase()}
//               </div>
//             )}
//             {!isRoom && onlineUserIds?.has(selectedUser?.id) && (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#282142] rounded-full" />
//             )}
//           </div>

//           <div>
//             <h2 className="text-white font-semibold leading-tight">
//               {isRoom ? `# ${selectedRoom.name}` : selectedUser?.name}
//             </h2>
//             <p className="text-[10px] text-green-400 font-medium">
//               {isRoom ? `${selectedRoom.member_count || ""} members` : onlineUserIds?.has(selectedUser?.id) ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-4 text-gray-400 mr-2">
//           <button className="hover:text-white transition-colors" title="Voice call">
//             <PhoneIcon />
//           </button>
//           <button className="hover:text-white transition-colors" title="Video call">
//             <VideoIcon />
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
//         {currentMessages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <div className="mb-3 text-gray-600">
//               <WaveIcon />
//             </div>
//             <p className="text-sm">No messages yet. Say hello!</p>
//           </div>
//         ) : (
//           currentMessages.map((msg, i) => {
//             const isSelf = msg.sender_id === userData?.id;
//             const showAvatar = i === 0 || currentMessages[i - 1].sender_id !== msg.sender_id;
//             const isFileMsg = msg.content?.startsWith("[File:") || msg.content?.startsWith("[Image:");

//             return (
//               <div
//                 key={msg.id}
//                 className={`flex gap-3 ${isSelf ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-4" : "mt-0.5"}`}
//                 onMouseEnter={() => setHoveredMsg(msg.id)}
//                 onMouseLeave={() => setHoveredMsg(null)}
//               >
//                 {showAvatar ? (
//                   <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-gradient-to-tr ${isSelf ? "from-indigo-500 to-purple-500" : "from-pink-500 to-orange-400"}`}>
//                     {(msg.sender_name || "U")[0].toUpperCase()}
//                   </div>
//                 ) : (
//                   <div className="w-8 flex-shrink-0" />
//                 )}

//                 <div className={`flex flex-col max-w-[65%] ${isSelf ? "items-end" : "items-start"}`}>
//                   {showAvatar && (
//                     <div className="flex items-baseline gap-2 mb-1">
//                       <span className={`text-xs font-semibold ${isSelf ? "text-indigo-300" : "text-gray-300"}`}>
//                         {isSelf ? "You" : msg.sender_name}
//                       </span>
//                       <span className="text-[10px] text-gray-500">
//                         {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex items-center gap-2">
//                     {/* Delete button — only for own messages, shows on hover */}
//                     {isSelf && hoveredMsg === msg.id && (
//                       <button
//                         onClick={() => handleDeleteMessage(msg)}
//                         className="text-gray-500 hover:text-red-400 transition-colors p-1"
//                         title="Delete message"
//                       >
//                         <TrashIcon />
//                       </button>
//                     )}
//                     <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${isSelf
//                       ? "bg-indigo-600 text-white rounded-tr-sm"
//                       : "bg-[#282142] text-gray-100 rounded-tl-sm border border-gray-700"
//                     } ${isFileMsg ? "flex items-center gap-2" : ""}`}>
//                       {isFileMsg && <FileIcon />}
//                       {msg.content}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* File Preview */}
//       {selectedFile && (
//         <div className="px-4 py-2 bg-[#282142] border-t border-gray-700">
//           <div className="flex items-center gap-3 bg-[#1e1a2d] rounded-xl p-3 max-w-xs">
//             {filePreview ? (
//               <img src={filePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
//             ) : (
//               <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400">
//                 <FileIcon />
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <p className="text-white text-xs font-medium truncate">{selectedFile.name}</p>
//               <p className="text-gray-500 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
//             </div>
//             <button onClick={removeFile} className="text-gray-400 hover:text-red-400 transition-colors">
//               <CloseIcon />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Input */}
//       <div className="p-4 bg-[#282142] border-t border-gray-700">
//         <div className="flex items-center gap-3 max-w-5xl mx-auto">
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*,.pdf,.doc,.docx,.txt,.zip"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//           <button
//             type="button"
//             onClick={() => fileInputRef.current.click()}
//             className="text-gray-400 hover:text-indigo-400 transition-colors flex-shrink-0"
//             title="Attach file"
//           >
//             <AttachIcon />
//           </button>
//           <input
//             type="text"
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             onKeyDown={e => e.key === "Enter" && handleSend()}
//             placeholder={isRoom ? `Message #${selectedRoom?.name}` : `Message ${selectedUser?.name}`}
//             className="flex-1 bg-[#1e1a2d] text-white text-sm rounded-full py-3 px-5 border border-gray-600 outline-none focus:border-indigo-500 transition-all placeholder-gray-500"
//           />
//           <button
//             onClick={handleSend}
//             disabled={!input.trim() && !selectedFile}
//             className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-full transition-all shadow-lg flex items-center justify-center"
//           >
//             <SendIcon />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;


import React, { useContext, useRef, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const VideoIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>);
const AttachIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>);
const SendIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const BackIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const FileIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
const CloseIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const ChatIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const TrashIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>);
const HashIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>);

const ChatContainer = () => {
  const {
    selectedRoom, setSelectedRoom,
    selectedUser, setSelectedUser,
    messages, setMessages,
    dmMessages, setDmMessages,
    sendMessage, sendDm,
    userData, backendUrl, onlineUserIds,
    startCall, // ← VC (new)
  } = useContext(AppContent);

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isRoom = !!selectedRoom;
  const currentMessages = isRoom ? messages : dmMessages;
  const currentTarget = isRoom ? selectedRoom : selectedUser;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentMessages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    if (selectedFile) {
      const fileMsg = selectedFile.type.startsWith("image/") ? `[Image: ${selectedFile.name}]` : `[File: ${selectedFile.name}]`;
      if (isRoom) await sendMessage(selectedRoom.id, fileMsg);
      else if (selectedUser) await sendDm(selectedUser.id, fileMsg);
      setSelectedFile(null); setFilePreview(null); fileInputRef.current.value = "";
    }
    if (input.trim()) {
      if (isRoom) await sendMessage(selectedRoom.id, input);
      else if (selectedUser) await sendDm(selectedUser.id, input);
      setInput("");
    }
  };

  const handleDeleteMessage = async (msg) => {
    try {
      const endpoint = isRoom ? `${backendUrl}/api/messages/message/${msg.id}` : `${backendUrl}/api/messages/dm/${msg.id}`;
      const res = await axios.delete(endpoint);
      if (res.data.success) {
        if (isRoom) setMessages(prev => prev.filter(m => m.id !== msg.id));
        else setDmMessages(prev => prev.filter(m => m.id !== msg.id));
        toast.success("Message deleted");
      }
    } catch (error) { toast.error(error.response?.data?.message || "Failed to delete message"); }
  };

  const removeFile = () => {
    setSelectedFile(null); setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── VC handlers (new) ────────────────────────────────────────────────────
  const handleVoiceCall = () => {
    if (!selectedUser) return toast.error("Voice calls are only available in DMs");
    startCall(selectedUser.id, selectedUser.name, "audio");
  };
  const handleVideoCall = () => {
    if (!selectedUser) return toast.error("Video calls are only available in DMs");
    startCall(selectedUser.id, selectedUser.name, "video");
  };
  // ── End VC handlers ───────────────────────────────────────────────────────

  if (!selectedRoom && !selectedUser) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-300"><ChatIcon /></div>
          <div>
            <h2 className="text-sm font-semibold text-gray-700">No conversation selected</h2>
            <p className="text-xs text-gray-400 mt-0.5">Choose a channel or direct message to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#f1f5f9] border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedRoom(null); setSelectedUser(null); }} className="md:hidden text-gray-400 hover:text-gray-600 p-1 transition-colors"><BackIcon /></button>
          <div className="relative flex-shrink-0">
            {!isRoom && currentTarget?.avatar
              ? <img src={currentTarget.avatar} alt={currentTarget.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              : <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isRoom ? "bg-blue-100 text-blue-600" : "bg-blue-600"}`}>{isRoom ? <HashIcon /> : currentTarget?.name?.[0]?.toUpperCase()}</div>
            }
            {!isRoom && (<div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#f1f5f9] ${onlineUserIds?.has(selectedUser?.id) ? "bg-emerald-500" : "bg-gray-300"}`} />)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 leading-tight">{isRoom ? `# ${selectedRoom.name}` : selectedUser?.name}</h2>
            <p className="text-[10px] mt-0.5">
              {isRoom
                ? <span className="text-gray-400">{selectedRoom.member_count || 0} members</span>
                : <span className={onlineUserIds?.has(selectedUser?.id) ? "text-emerald-500 font-medium" : "text-gray-400"}>{onlineUserIds?.has(selectedUser?.id) ? "Active now" : "Offline"}</span>
              }
            </p>
          </div>
        </div>
        {/* Call buttons — active in DMs, dimmed in rooms */}
        <div className="flex items-center gap-1">
          <button onClick={handleVoiceCall}
            className={`p-2 rounded-md transition-colors ${!isRoom ? "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" : "text-gray-200 cursor-not-allowed"}`}
            title={isRoom ? "Voice calls available in DMs only" : "Voice call"}><PhoneIcon /></button>
          <button onClick={handleVideoCall}
            className={`p-2 rounded-md transition-colors ${!isRoom ? "text-gray-400 hover:text-blue-600 hover:bg-blue-50" : "text-gray-200 cursor-not-allowed"}`}
            title={isRoom ? "Video calls available in DMs only" : "Video call"}><VideoIcon /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 custom-scrollbar">
        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isRoom ? "bg-blue-100 text-blue-500" : "bg-blue-600 text-white"}`}>
              {isRoom ? <HashIcon /> : <span className="text-sm font-bold">{currentTarget?.name?.[0]?.toUpperCase()}</span>}
            </div>
            <p className="text-xs font-semibold text-gray-700">{isRoom ? `Welcome to #${selectedRoom.name}` : `Start a conversation with ${selectedUser?.name}`}</p>
            <p className="text-[11px] text-gray-400">This is the beginning of the conversation.</p>
          </div>
        ) : (
          currentMessages.map((msg, i) => {
            const isSelf = msg.sender_id === userData?.id;
            const prevMsg = currentMessages[i - 1];
            const showAvatar = i === 0 || prevMsg?.sender_id !== msg.sender_id;
            const isFileMsg = msg.content?.startsWith("[File:") || msg.content?.startsWith("[Image:");
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isSelf ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-4" : "mt-0.5"}`}
                onMouseEnter={() => setHoveredMsg(msg.id)} onMouseLeave={() => setHoveredMsg(null)}>
                {showAvatar
                  ? <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mb-0.5 ${isSelf ? "bg-blue-600" : "bg-gray-300 text-gray-600"}`}>{(msg.sender_name || "U")[0].toUpperCase()}</div>
                  : <div className="w-7 flex-shrink-0" />
                }
                <div className={`flex flex-col max-w-[68%] sm:max-w-[60%] ${isSelf ? "items-end" : "items-start"}`}>
                  {showAvatar && (
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className={`text-[11px] font-semibold ${isSelf ? "text-blue-600" : "text-gray-600"}`}>{isSelf ? "You" : msg.sender_name}</span>
                      <span className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    {isSelf && hoveredMsg === msg.id && (
                      <button onClick={() => handleDeleteMessage(msg)} className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"><TrashIcon /></button>
                    )}
                    <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${isSelf ? "bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-sm" : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm"} ${isFileMsg ? "flex items-center gap-2" : ""}`}>
                      {isFileMsg && <FileIcon />}
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File preview */}
      {selectedFile && (
        <div className="px-5 py-2 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2.5 max-w-xs">
            {filePreview ? <img src={filePreview} alt="preview" className="w-12 h-12 rounded-md object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0"><FileIcon /></div>}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"><CloseIcon /></button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-3 border-t border-gray-200 bg-[#f1f5f9] flex-shrink-0">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all max-w-5xl mx-auto">
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt,.zip" onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0 p-0.5" title="Attach file"><AttachIcon /></button>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={isRoom ? `Message #${selectedRoom?.name}` : `Message ${selectedUser?.name}`}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
          <button onClick={handleSend} disabled={!input.trim() && !selectedFile}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white flex items-center justify-center transition-colors shadow-sm">
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">Press <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 text-[9px] text-gray-500">Enter</kbd> to send</p>
      </div>
    </div>
  );
};

export default ChatContainer;
