import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Login = () => {

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, setAuthToken } = useContext(AppContent)

  const [state, setState] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    try {
      if (state === 'signup') {
        const res = await axios.post(backendUrl + '/api/auth/signup', { name, email, password });
        const data = res.data;

        if (data.success) {
          localStorage.setItem('token', data.token);  // ← save token
          setAuthToken(data.token);                    // ← set in axios headers
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }

      } else {
        const res = await axios.post(backendUrl + '/api/auth/login', { email, password });
        const data = res.data;

        if (data.success) {
          localStorage.setItem('token', data.token);  // ← save token
          setAuthToken(data.token);                    // ← set in axios headers
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='flex items-center justify-end min-h-screen px-6 md:pr-20 bg-gradient-to-br from-slate-900 to-purple-400'>
      <div className='text-white justify-end min-h-screen pt-20 px-6 md:pr-[500px]'>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='text-[20px] justify-start md:pl-9 py-2'>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className='text-[40px]'>W</motion.span>elcome to
        </motion.p>

        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='text-4xl font-bold justify-start md:pl-9 py-2'>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className='text-[90px]'>W</motion.span>connect
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
        </motion.h1>

        <motion.h1
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className='text-[30px] font-serif justify-start md:pl-9 pt-20'>
          Create Your Account <br /> <span>or</span> <br /> <span>Sign in</span> <span>-------------</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'signup' ? 'Create account' : 'Login account'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'signup' ? 'Create your account' : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandle}>
          {state === 'signup' && (
            <div className='mb-4 flex items-center gap-3 text-white w-full px-5 py-2.5 rounded-full bg-[#b4291f]'>
              <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 text-white rounded-full bg-[#b4291f]'>
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email id' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full text-white px-5 py-2.5 rounded-full bg-[#b4291f]'>
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-blue-400 cursor-pointer'>Forgot Password?</p>

          <button className='w-full py-2.5 rounded-full bg-red-700 text-white hover:bg-red-300 font-medium'>
            {state === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {state === 'signup' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
            <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('login')}>Login here</span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
            <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('signup')}>Sign up</span>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;