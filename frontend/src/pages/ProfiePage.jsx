// import React, { useContext, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// // SVG Icons
// const BackIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="15 18 9 12 15 6"/>
//   </svg>
// );

// const EditIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// );

// const UserIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
//     <circle cx="12" cy="7" r="4"/>
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
//     <path d="M7 11V7a5 5 0 0110 0v4"/>
//   </svg>
// );

// const CheckIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12"/>
//   </svg>
// );

// const WarnIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
//     <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
//   </svg>
// );

// const CameraIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
//     <circle cx="12" cy="13" r="4"/>
//   </svg>
// );

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const { userData, setUserData, backendUrl } = useContext(AppContent);

//   const [activeTab, setActiveTab] = useState("profile");
//   const [name, setName] = useState(userData?.name || "");
//   const [bio, setBio] = useState(userData?.bio || "");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || null);
//   const avatarInputRef = useRef(null);

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setAvatarPreview(URL.createObjectURL(file));
//     const formData = new FormData();
//     formData.append("avatar", file);
//     setLoading(true);
//     try {
//       const res = await axios.put(`${backendUrl}/api/user/avatar`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.data.success) {
//         setUserData(res.data.userData);
//         setAvatarPreview(res.data.userData.avatar);
//         toast.success("Profile picture updated!");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to upload image");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     if (!name.trim()) return toast.error("Name is required");
//     setLoading(true);
//     try {
//       const res = await axios.put(`${backendUrl}/api/user/update`, { name, bio });
//       if (res.data.success) {
//         setUserData(res.data.userData);
//         toast.success("Profile updated successfully!");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (!currentPassword || !newPassword || !confirmPassword) return toast.error("All fields are required");
//     if (newPassword !== confirmPassword) return toast.error("New passwords don't match");
//     if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
//     setLoading(true);
//     try {
//       const res = await axios.put(`${backendUrl}/api/user/change-password`, { currentPassword, newPassword });
//       if (res.data.success) {
//         toast.success("Password changed successfully!");
//         setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to change password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1e1a2d] flex flex-col">

//       {/* Header */}
//       <div className="bg-[#282142] border-b border-gray-700 px-6 py-4 flex items-center gap-4">
//         <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors">
//           <BackIcon />
//         </button>
//         <h1 className="text-white font-bold text-xl">Profile Settings</h1>
//       </div>

//       <div className="flex-1 flex flex-col md:flex-row max-w-4xl mx-auto w-full p-6 gap-6">

//         {/* Left */}
//         <div className="md:w-72 flex flex-col gap-4">
//           <div className="bg-[#282142] rounded-2xl p-6 flex flex-col items-center border border-gray-700">

//             {/* Avatar */}
//             <div className="relative mb-4">
//               <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 overflow-hidden">
//                 {avatarPreview ? (
//                   <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
//                     {userData?.name?.[0]?.toUpperCase() || "U"}
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={() => avatarInputRef.current.click()}
//                 className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white border-2 border-[#282142] transition-all"
//               >
//                 <CameraIcon />
//               </button>
//               <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
//             </div>

//             <h2 className="text-white font-bold text-lg">{userData?.name}</h2>
//             <p className="text-gray-400 text-sm">{userData?.email}</p>
//             <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${userData?.is_account_verified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
//               {userData?.is_account_verified ? <><CheckIcon /> Verified</> : <><WarnIcon /> Not Verified</>}
//             </div>
//             {userData?.bio && (
//               <p className="text-gray-400 text-sm text-center mt-3 italic">"{userData.bio}"</p>
//             )}
//           </div>

//           {/* Tabs */}
//           <div className="bg-[#282142] rounded-2xl border border-gray-700 overflow-hidden">
//             {["profile", "password"].map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`w-full px-4 py-3 text-left text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
//               >
//                 {tab === "profile" ? <><UserIcon /> Edit Profile</> : <><LockIcon /> Change Password</>}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right */}
//         <div className="flex-1">

//           {activeTab === "profile" && (
//             <div className="bg-[#282142] rounded-2xl p-6 border border-gray-700">
//               <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><UserIcon /> Edit Profile</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
//                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
//                     className="w-full bg-[#1e1a2d] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 transition-all placeholder-gray-500" />
//                 </div>
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">Email</label>
//                   <input type="text" value={userData?.email || ""} disabled
//                     className="w-full bg-[#1e1a2d]/50 text-gray-500 text-sm rounded-xl px-4 py-3 outline-none border border-gray-700 cursor-not-allowed" />
//                   <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
//                 </div>
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">Bio</label>
//                   <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell something about yourself..." rows={3}
//                     className="w-full bg-[#1e1a2d] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 transition-all placeholder-gray-500 resize-none" />
//                 </div>
//                 <button onClick={handleUpdateProfile} disabled={loading}
//                   className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all">
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === "password" && (
//             <div className="bg-[#282142] rounded-2xl p-6 border border-gray-700">
//               <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><LockIcon /> Change Password</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
//                   <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password"
//                     className="w-full bg-[#1e1a2d] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 transition-all placeholder-gray-500" />
//                 </div>
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">New Password</label>
//                   <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password"
//                     className="w-full bg-[#1e1a2d] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 transition-all placeholder-gray-500" />
//                 </div>
//                 <div>
//                   <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
//                   <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
//                     className="w-full bg-[#1e1a2d] text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-600 focus:border-indigo-500 transition-all placeholder-gray-500" />
//                 </div>
//                 <button onClick={handleChangePassword} disabled={loading}
//                   className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all">
//                   {loading ? "Changing..." : "Change Password"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CameraIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const inputCls = "w-full bg-gray-50 text-gray-800 text-sm rounded-lg px-3.5 py-2.5 outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition placeholder-gray-400";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userData, setUserData, backendUrl } = useContext(AppContent);

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(userData?.name || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || null);
  const avatarInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("avatar", file);
    setLoading(true);
    try {
      const res = await axios.put(`${backendUrl}/api/user/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setUserData(res.data.userData);
        setAvatarPreview(res.data.userData.avatar);
        toast.success("Profile picture updated!");
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally { setLoading(false); }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setLoading(true);
    try {
      const res = await axios.put(`${backendUrl}/api/user/update`, { name, bio });
      if (res.data.success) { setUserData(res.data.userData); toast.success("Profile updated successfully!"); }
      else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("All fields are required");
    if (newPassword !== confirmPassword) return toast.error("New passwords don't match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await axios.put(`${backendUrl}/api/user/change-password`, { currentPassword, newPassword });
      if (res.data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header — dark slate matching sidebar */}
      <div className="bg-[#1e293b] border-b border-slate-700/60 px-6 py-3.5 flex items-center gap-3">
        <button onClick={() => navigate("/")}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-700/50 transition-colors">
          <BackIcon />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">W</span>
          </div>
          <h1 className="text-slate-100 font-semibold text-base tracking-tight">Profile Settings</h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-4xl mx-auto w-full p-5 gap-5">

        {/* Left panel — dark slate */}
        <div className="md:w-64 flex flex-col gap-4 flex-shrink-0">

          {/* Avatar card */}
          <div className="bg-[#1e293b] rounded-xl p-5 flex flex-col items-center border border-slate-700/60">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-blue-500/30">
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {userData?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                }
              </div>
              <button onClick={() => avatarInputRef.current.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white border-2 border-[#1e293b] transition-colors">
                <CameraIcon />
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            <h2 className="text-slate-100 font-semibold text-sm">{userData?.name}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{userData?.email}</p>

            <div className={`mt-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${userData?.is_account_verified ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400"}`}>
              {userData?.is_account_verified ? <><CheckIcon />Verified</> : <><WarnIcon />Not Verified</>}
            </div>

            {userData?.bio && (
              <p className="text-slate-500 text-xs text-center mt-3 italic leading-relaxed">"{userData.bio}"</p>
            )}
          </div>

          {/* Tab nav — dark slate */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/60 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-700/40">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Settings</span>
            </div>
            {["profile", "password"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-all flex items-center gap-2
                  ${activeTab === tab
                    ? "bg-blue-500/15 text-blue-400 border-l-2 border-blue-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 border-l-2 border-transparent"
                  }`}>
                {tab === "profile" ? <><UserIcon />Edit Profile</> : <><LockIcon />Change Password</>}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel — clean light */}
        <div className="flex-1 min-w-0">

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <UserIcon />
                </div>
                <h3 className="text-gray-800 font-semibold text-sm">Edit Profile</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
                  <input type="text" value={userData?.email || ""} disabled
                    className="w-full bg-gray-100 text-gray-400 text-sm rounded-lg px-3.5 py-2.5 outline-none border border-gray-200 cursor-not-allowed" />
                  <p className="text-gray-400 text-[10px] mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Tell something about yourself..." rows={3}
                    className={`${inputCls} resize-none`} />
                </div>
                <button onClick={handleUpdateProfile} disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <LockIcon />
                </div>
                <h3 className="text-gray-800 font-semibold text-sm">Change Password</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" className={inputCls} />
                </div>
                <button onClick={handleChangePassword} disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
