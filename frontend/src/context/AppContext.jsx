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
  const [activeTab, setActiveTab] = useState("rooms");
  const [allUsers, setAllUsers] = useState([]);

  const socketRef = useRef(null);

  // Set token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Init socket
  const initSocket = (token) => {
    if (socketRef.current) return;

    const socket = io(backendUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("🔌 Socket connected"));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("receive_dm", (message) => {
      setDmMessages((prev) => [...prev, message]);
    });

    socket.on("room_users", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current = socket;
  };

  // Check auth state on page load
  const getAuthState = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setAuthToken(token);
    try {
      const res = await axios.get(backendUrl + "/api/auth/is-auth");
      if (res.data.success) {
        setIsLoggedin(true);
        getUserData();
        initSocket(token);
      }
    } catch (error) {
      if (error.response?.status !== 401) console.log(error);
      localStorage.removeItem("token");
      setAuthToken(null);
    }
  };

  // Get logged-in user
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

  // Get all users for DMs
  const getAllUsers = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/all");
      if (res.data.success) setAllUsers(res.data.users);
    } catch (error) {
      console.log("Failed to load users");
    }
  };

  // Get all rooms
  const getRooms = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/rooms");
      if (res.data.success) setRooms(res.data.rooms);
    } catch (error) {
      toast.error("Failed to load rooms");
    }
  };

  // Get room messages
  const getRoomMessages = async (roomId) => {
    try {
      const res = await axios.get(backendUrl + `/api/messages/room/${roomId}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // Get DM messages
  const getDmMessages = async (userId) => {
    try {
      const res = await axios.get(backendUrl + `/api/messages/dm/${userId}`);
      if (res.data.success) setDmMessages(res.data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // Send room message
  const sendMessage = async (roomId, content) => {
    try {
      const res = await axios.post(backendUrl + "/api/messages/send", { roomId, content });
      if (res.data.success) {
        socketRef.current?.emit("send_message", {
          roomId,
          message: res.data.message,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  // Send DM
  const sendDm = async (receiverId, content) => {
    try {
      const res = await axios.post(backendUrl + "/api/messages/dm/send", { receiverId, content });
      if (res.data.success) {
        setDmMessages((prev) => [...prev, res.data.message]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  // Join room via socket
  const joinRoomSocket = (roomId) => {
    socketRef.current?.emit("join_room", {
      roomId,
      userId: userData?.id,
      username: userData?.name,
    });
  };

  useEffect(() => {
    getAuthState();
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      getRooms();
      getAllUsers();
    }
  }, [isLoggedin]);

  useEffect(() => {
    if (selectedRoom) {
      getRoomMessages(selectedRoom.id);
      joinRoomSocket(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedUser) {
      getDmMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData, setAuthToken,
    rooms, setRooms, getRooms,
    allUsers,
    selectedRoom, setSelectedRoom,
    selectedUser, setSelectedUser,
    messages, setMessages,
    dmMessages, setDmMessages,
    onlineUsers,
    activeTab, setActiveTab,
    sendMessage, sendDm,
    socket: socketRef,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
