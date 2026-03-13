

import React, { useContext, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
  const inputRefs = React.useRef([]);
  const navigate = useNavigate();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map(e => e.value).join('');
      const res = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.is_account_verified && navigate('/');
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1e293b] px-4">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">W</span>
          </div>
          <span className="text-gray-900 font-bold text-lg tracking-tight">Wconnect</span>
        </div>

        {/* Email icon */}
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 className="text-gray-900 font-bold text-xl text-center mb-1">Verify your email</h1>
        <p className="text-gray-400 text-xs text-center mb-7 leading-relaxed">
          Enter the 6-digit code sent to your email address
        </p>

        {/* OTP inputs */}
        <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              required
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-11 h-12 bg-gray-50 border border-gray-200 text-gray-900 text-center text-lg font-bold rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
            />
          ))}
        </div>

        <button type="submit"
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
          Verify Email
        </button>

        <p className="text-xs text-gray-400 text-center mt-5">
          Didn't receive the code?{' '}
          <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold">Resend</span>
        </p>
      </motion.form>
    </div>
  );
};

export default EmailVerify;
