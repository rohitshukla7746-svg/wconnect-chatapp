// import React, { createContext, useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// export const AppContent = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [dmMessages, setDmMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]); // room users (for Online tab)
//   const [onlineUserIds, setOnlineUserIds] = useState(new Set()); // global online user IDs
//   const [activeTab, setActiveTab] = useState("rooms");
//   const [allUsers, setAllUsers] = useState([]);

//   const socketRef = useRef(null);
//   const selectedRoomRef = useRef(null);
//   const selectedUserRef = useRef(null);

//   useEffect(() => { selectedRoomRef.current = selectedRoom; }, [selectedRoom]);
//   useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);

//   const setAuthToken = (token) => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       localStorage.setItem("token", token);
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//       localStorage.removeItem("token");
//     }
//   };

//   const initSocket = (userId) => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     }

//     const token = localStorage.getItem("token");

//     const socket = io(backendUrl, {
//       auth: { token },
//       transports: ["websocket", "polling"],
//     });

//     socket.on("connect", () => {
//       console.log("🔌 Socket connected");
//       socket.emit("register", userId);
//       console.log("✅ Registered userId:", userId);
//     });

//     socket.on("disconnect", () => console.log("❌ Socket disconnected"));

//     socket.on("receive_message", (message) => {
//       if (selectedRoomRef.current?.id === message.room_id) {
//         setMessages((prev) => {
//           if (prev.find((m) => m.id === message.id)) return prev;
//           return [...prev, message];
//         });
//       }
//     });

//     socket.on("receive_dm", (message) => {
//       const currentUser = selectedUserRef.current;
//       if (
//         currentUser &&
//         (message.sender_id === currentUser.id || message.receiver_id === currentUser.id)
//       ) {
//         setDmMessages((prev) => {
//           if (prev.find((m) => m.id === message.id)) return prev;
//           return [...prev, message];
//         });
//       }
//     });

//     socket.on("room_users", (users) => setOnlineUsers(users));
//     socket.on("room_created", () => getRooms());

//     // Global online presence
//     socket.on("online_users", (userIds) => {
//       setOnlineUserIds(new Set(userIds));
//     });

//     socketRef.current = socket;
//   };

//   const getAuthState = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     setAuthToken(token);
//     try {
//       const res = await axios.get(backendUrl + "/api/auth/is-auth");
//       if (res.data.success) {
//         setIsLoggedin(true);
//         const userRes = await axios.get(backendUrl + "/api/user/data");
//         if (userRes.data.success) {
//           setUserData(userRes.data.userData);
//           initSocket(userRes.data.userData.id);
//         }
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         setAuthToken(null);
//       } else {
//         console.log(error);
//       }
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const res = await axios.get(backendUrl + "/api/user/data");
//       if (res.data.success) {
//         setUserData(res.data.userData);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to load user");
//     }
//   };

//   const getAllUsers = async () => {
//     try {
//       const res = await axios.get(backendUrl + "/api/user/all");
//       if (res.data.success) setAllUsers(res.data.users);
//     } catch (error) {
//       console.log("Failed to load users");
//     }
//   };

//   const getRooms = async () => {
//     try {
//       const res = await axios.get(backendUrl + "/api/rooms");
//       if (res.data.success) setRooms(res.data.rooms);
//     } catch (error) {
//       toast.error("Failed to load rooms");
//     }
//   };

//   const getRoomMessages = async (roomId) => {
//     try {
//       const res = await axios.get(backendUrl + `/api/messages/room/${roomId}`);
//       if (res.data.success) setMessages(res.data.messages);
//     } catch (error) {
//       toast.error("Failed to load messages");
//     }
//   };

//   const getDmMessages = async (userId) => {
//     try {
//       const res = await axios.get(backendUrl + `/api/messages/dm/${userId}`);
//       if (res.data.success) setDmMessages(res.data.messages);
//     } catch (error) {
//       toast.error("Failed to load messages");
//     }
//   };

//   const sendMessage = async (roomId, content) => {
//     try {
//       const res = await axios.post(backendUrl + "/api/messages/send", { roomId, content });
//       if (res.data.success) {
//         setMessages((prev) => {
//           if (prev.find((m) => m.id === res.data.message.id)) return prev;
//           return [...prev, res.data.message];
//         });
//         socketRef.current?.emit("send_message", { roomId, message: res.data.message });
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send message");
//     }
//   };

//   const sendDm = async (receiverId, content) => {
//     try {
//       const res = await axios.post(backendUrl + "/api/messages/dm/send", { receiverId, content });
//       if (res.data.success) {
//         setDmMessages((prev) => {
//           if (prev.find((m) => m.id === res.data.message.id)) return prev;
//           return [...prev, res.data.message];
//         });
//         socketRef.current?.emit("send_dm", { receiverId, message: res.data.message });
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send message");
//     }
//   };

//   const joinRoomSocket = (roomId) => {
//     socketRef.current?.emit("join_room", {
//       roomId,
//       userId: userData?.id,
//       username: userData?.name,
//     });
//   };

//   useEffect(() => { getAuthState(); }, []);

//   useEffect(() => {
//     if (isLoggedin) {
//       getRooms();
//       getAllUsers();
//     }
//   }, [isLoggedin]);

//   useEffect(() => {
//     setMessages([]);
//     if (selectedRoom) {
//       getRoomMessages(selectedRoom.id);
//       joinRoomSocket(selectedRoom.id);
//     }
//   }, [selectedRoom]);

//   useEffect(() => {
//     setDmMessages([]);
//     if (selectedUser) {
//       getDmMessages(selectedUser.id);
//     }
//   }, [selectedUser]);

//   const value = {
//     backendUrl,
//     isLoggedin, setIsLoggedin,
//     userData, setUserData,
//     getUserData, setAuthToken, initSocket,
//     rooms, setRooms, getRooms,
//     allUsers, getAllUsers,
//     selectedRoom, setSelectedRoom,
//     selectedUser, setSelectedUser,
//     messages, setMessages,
//     dmMessages, setDmMessages,
//     onlineUsers,
//     onlineUserIds, // <-- expose this for checking if a user is online
//     activeTab, setActiveTab,
//     sendMessage, sendDm,
//     getRoomMessages, getDmMessages,
//     socket: socketRef,
//   };

//   return (
//     <AppContent.Provider value={value}>
//       {props.children}
//     </AppContent.Provider>
//   );
// };


import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dmMessages, setDmMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("rooms");
  const [allUsers, setAllUsers] = useState([]);

  // ── VC State (new) ───────────────────────────────────────────────────────
  const [callState, setCallState] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  // ── End VC State ─────────────────────────────────────────────────────────

  const socketRef = useRef(null);
  const selectedRoomRef = useRef(null);
  const selectedUserRef = useRef(null);

  useEffect(() => { selectedRoomRef.current = selectedRoom; }, [selectedRoom]);
  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  const initSocket = (userId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token = localStorage.getItem("token");

    const socket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected");
      socket.emit("register", userId);
      console.log("✅ Registered userId:", userId);
    });

    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    socket.on("receive_message", (message) => {
      if (selectedRoomRef.current?.id === message.room_id) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    socket.on("receive_dm", (message) => {
      const currentUser = selectedUserRef.current;
      if (
        currentUser &&
        (message.sender_id === currentUser.id || message.receiver_id === currentUser.id)
      ) {
        setDmMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    socket.on("room_users", (users) => setOnlineUsers(users));
    socket.on("room_created", () => getRooms());
    socket.on("online_users", (userIds) => setOnlineUserIds(new Set(userIds)));

    // ── VC: listen for incoming call offer ───────────────────────────────
    socket.on("call_offer", ({ offer, callerId, callerName, type }) => {
      setIncomingCall({ offer, callerId, callerName, type });
    });
    // ── End VC listeners ─────────────────────────────────────────────────

    socketRef.current = socket;
  };

  const getAuthState = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setAuthToken(token);
    try {
      const res = await axios.get(backendUrl + "/api/auth/is-auth");
      if (res.data.success) {
        setIsLoggedin(true);
        const userRes = await axios.get(backendUrl + "/api/user/data");
        if (userRes.data.success) {
          setUserData(userRes.data.userData);
          initSocket(userRes.data.userData.id);
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthToken(null);
      } else {
        console.log(error);
      }
    }
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/data");
      if (res.data.success) {
        setUserData(res.data.userData);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user");
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/all");
      if (res.data.success) setAllUsers(res.data.users);
    } catch (error) {
      console.log("Failed to load users");
    }
  };

  const getRooms = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/rooms");
      if (res.data.success) setRooms(res.data.rooms);
    } catch (error) {
      toast.error("Failed to load rooms");
    }
  };

  const getRoomMessages = async (roomId) => {
    try {
      const res = await axios.get(backendUrl + `/api/messages/room/${roomId}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const getDmMessages = async (userId) => {
    try {
      const res = await axios.get(backendUrl + `/api/messages/dm/${userId}`);
      if (res.data.success) setDmMessages(res.data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (roomId, content) => {
    try {
      const res = await axios.post(backendUrl + "/api/messages/send", { roomId, content });
      if (res.data.success) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === res.data.message.id)) return prev;
          return [...prev, res.data.message];
        });
        socketRef.current?.emit("send_message", { roomId, message: res.data.message });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const sendDm = async (receiverId, content) => {
    try {
      const res = await axios.post(backendUrl + "/api/messages/dm/send", { receiverId, content });
      if (res.data.success) {
        setDmMessages((prev) => {
          if (prev.find((m) => m.id === res.data.message.id)) return prev;
          return [...prev, res.data.message];
        });
        socketRef.current?.emit("send_dm", { receiverId, message: res.data.message });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const joinRoomSocket = (roomId) => {
    socketRef.current?.emit("join_room", {
      roomId,
      userId: userData?.id,
      username: userData?.name,
    });
  };

  // ── VC helper ────────────────────────────────────────────────────────────
  const startCall = (targetId, targetName, type = "video") => {
    setCallState({ status: "calling", targetId, targetName, type });
  };
  // ── End VC helper ────────────────────────────────────────────────────────

  useEffect(() => { getAuthState(); }, []);

  useEffect(() => {
    if (isLoggedin) { getRooms(); getAllUsers(); }
  }, [isLoggedin]);

  useEffect(() => {
    setMessages([]);
    if (selectedRoom) { getRoomMessages(selectedRoom.id); joinRoomSocket(selectedRoom.id); }
  }, [selectedRoom]);

  useEffect(() => {
    setDmMessages([]);
    if (selectedUser) { getDmMessages(selectedUser.id); }
  }, [selectedUser]);

  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData, setAuthToken, initSocket,
    rooms, setRooms, getRooms,
    allUsers, getAllUsers,
    selectedRoom, setSelectedRoom,
    selectedUser, setSelectedUser,
    messages, setMessages,
    dmMessages, setDmMessages,
    onlineUsers,
    onlineUserIds,
    activeTab, setActiveTab,
    sendMessage, sendDm,
    getRoomMessages, getDmMessages,
    socket: socketRef,
    // ── VC (new) ─────────────────────────────────────────────────────────
    callState, setCallState,
    incomingCall, setIncomingCall,
    startCall,
    // ── End VC ───────────────────────────────────────────────────────────
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
