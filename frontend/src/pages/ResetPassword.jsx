import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from "react-toastify";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

// SVG Icons
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus();
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0)
      inputRefs.current[index - 1].focus();
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email }, { withCredentials: true });
      if (res.data.success) { toast.success(res.data.message); setIsEmailSent(true); }
      else toast.error(res.data.message);
      res.data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword }, { withCredentials: true });
      res.data.success ? toast.success(res.data.message) : toast.error(res.data.message);
      res.data.success && navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const inputCls = "w-full bg-gray-50 text-gray-800 text-sm rounded-lg px-3.5 py-2.5 outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition placeholder-gray-400";
  const currentStep = !isEmailSent ? 1 : !isOtpSubmitted ? 2 : 3;
  const steps = ["Email", "OTP", "Password"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1e293b] px-4">
      <motion.div
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

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${currentStep > i + 1 ? "bg-emerald-500 text-white" : currentStep === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {currentStep > i + 1 ? <CheckIcon /> : i + 1}
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${currentStep === i + 1 ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 mb-4 transition-all ${currentStep > i + 1 ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 — Email */}
          {!isEmailSent && (
            <motion.form key="email"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} onSubmit={onSubmitEmail}>

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                <MailIcon />
              </div>
              <h2 className="text-gray-900 font-bold text-lg text-center mb-1">Forgot password?</h2>
              <p className="text-gray-400 text-xs text-center mb-5 leading-relaxed">
                Enter your registered email address
              </p>
              <div className="mb-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required className={inputCls} />
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
                Send Reset Code
              </button>
              <button type="button" onClick={() => navigate('/login')}
                className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                <BackIcon /> Back to Sign In
              </button>
            </motion.form>
          )}

          {/* Step 2 — OTP */}
          {!isOtpSubmitted && isEmailSent && (
            <motion.form key="otp"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} onSubmit={onSubmitOtp}>

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                <LockIcon />
              </div>
              <h2 className="text-gray-900 font-bold text-lg text-center mb-1">Enter reset code</h2>
              <p className="text-gray-400 text-xs text-center mb-5 leading-relaxed">
                We sent a 6-digit code to <span className="font-medium text-gray-600">{email}</span>
              </p>
              <div className="flex justify-between gap-2 mb-5" onPaste={handlePaste}>
                {Array(6).fill(0).map((_, index) => (
                  <input key={index} type="text" maxLength="1" required
                    ref={e => inputRefs.current[index] = e}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-11 bg-gray-50 border border-gray-200 text-gray-900 text-center text-lg font-bold rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                  />
                ))}
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
                Verify Code
              </button>
              <button type="button" onClick={() => setIsEmailSent(false)}
                className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                <BackIcon /> Back
              </button>
            </motion.form>
          )}

          {/* Step 3 — New Password */}
          {isOtpSubmitted && isEmailSent && (
            <motion.form key="password"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} onSubmit={onSubmitNewPassword}>

              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <ShieldIcon />
              </div>
              <h2 className="text-gray-900 font-bold text-lg text-center mb-1">Set new password</h2>
              <p className="text-gray-400 text-xs text-center mb-5 leading-relaxed">
                Choose a strong password for your account
              </p>
              <div className="mb-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} required className={inputCls} />
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
                Reset Password
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
