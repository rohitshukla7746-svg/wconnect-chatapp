// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom'
// import { AppContent } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";

// const Login = () => {

//   const navigate = useNavigate();
//   const { backendUrl, setIsLoggedin, getUserData, setAuthToken, initSocket } = useContext(AppContent);

//   const [state, setState] = useState('signup');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const onSubmitHandle = async (e) => {
//     e.preventDefault();

//     try {
//       if (state === 'signup') {
//         const res = await axios.post(backendUrl + '/api/auth/signup', { name, email, password });
//         const data = res.data;

//         if (data.success) {
//           setAuthToken(data.token);
//           setIsLoggedin(true);
//           getUserData();
//           initSocket(data.user.id);
//           navigate('/');
//         } else {
//           toast.error(data.message);
//         }

//       } else {
//         const res = await axios.post(backendUrl + '/api/auth/login', { email, password });
//         const data = res.data;

//         if (data.success) {
//           setAuthToken(data.token);
//           setIsLoggedin(true);
//           getUserData();
//           initSocket(data.user.id);
//           navigate('/');
//         } else {
//           toast.error(data.message);
//         }
//       }

//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className='flex items-center justify-end min-h-screen px-6 md:pr-20 bg-gradient-to-br from-slate-900 to-purple-400'>
//       <div className='text-white justify-end min-h-screen pt-20 px-6 md:pr-[500px]'>
//         <motion.p
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 1 }}
//           className='text-[20px] justify-start md:pl-9 py-2'>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className='text-[40px]'>W</motion.span>elcome to
//         </motion.p>

//         <motion.h1
//           initial={{ y: -100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 1 }}
//           className='text-4xl font-bold justify-start md:pl-9 py-2'>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className='text-[90px]'>W</motion.span>connect
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8, repeat: Infinity, repeatType: "loop" }}>.</motion.span>
//         </motion.h1>

//         <motion.h1
//           initial={{ y: 200, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 3 }}
//           className='text-[30px] font-serif justify-start md:pl-9 pt-20'>
//           Create Your Account <br /> <span>or</span> <br /> <span>Sign in</span> <span>-------------</span>
//         </motion.h1>
//       </div>

//       <motion.div
//         initial={{ x: 50, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 1, delay: 2 }}
//         className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
//         <h2 className='text-3xl font-semibold text-white text-center mb-3'>
//           {state === 'signup' ? 'Create account' : 'Login account'}
//         </h2>
//         <p className='text-center text-sm mb-6'>
//           {state === 'signup' ? 'Create your account' : 'Login to your account'}
//         </p>

//         <form onSubmit={onSubmitHandle}>
//           {state === 'signup' && (
//             <div className='mb-4 flex items-center gap-3 text-white w-full px-5 py-2.5 rounded-full bg-[#b4291f]'>
//               <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
//             </div>
//           )}

//           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 text-white rounded-full bg-[#b4291f]'>
//             <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email id' required />
//           </div>

//           <div className='mb-4 flex items-center gap-3 w-full text-white px-5 py-2.5 rounded-full bg-[#b4291f]'>
//             <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
//           </div>

//           <p onClick={() => navigate('/reset-password')} className='mb-4 text-blue-400 cursor-pointer'>Forgot Password?</p>

//           <button className='w-full py-2.5 rounded-full bg-red-700 text-white hover:bg-red-300 font-medium'>
//             {state === 'signup' ? 'Sign Up' : 'Login'}
//           </button>
//         </form>

//         {state === 'signup' ? (
//           <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
//             <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('login')}>Login here</span>
//           </p>
//         ) : (
//           <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
//             <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('signup')}>Sign up</span>
//           </p>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, setAuthToken, initSocket } = useContext(AppContent);

  const [state, setState] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      if (state === 'signup') {
        const res = await axios.post(backendUrl + '/api/auth/signup', { name, email, password });
        const data = res.data;
        if (data.success) {
          setAuthToken(data.token); setIsLoggedin(true);
          getUserData(); initSocket(data.user.id); navigate('/');
        } else toast.error(data.message);
      } else {
        const res = await axios.post(backendUrl + '/api/auth/login', { email, password });
        const data = res.data;
        if (data.success) {
          setAuthToken(data.token); setIsLoggedin(true);
          getUserData(); initSocket(data.user.id); navigate('/');
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const inputCls = "w-full bg-gray-50 text-gray-800 text-sm rounded-lg px-3.5 py-2.5 outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition placeholder-gray-400";

  return (
    <div className="flex items-center justify-end min-h-screen px-6 md:pr-20 bg-[#1e293b]">

      {/* Left branding panel */}
      <div className="text-white justify-end min-h-screen pt-20 px-6 md:pr-[500px]">
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-[20px] justify-start md:pl-9 py-2">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="text-[40px] text-blue-400">W</motion.span>
          <span className="text-slate-300">elcome to</span>
        </motion.p>

        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-4xl font-bold justify-start md:pl-9 py-2">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="text-[90px] text-white leading-none">W</motion.span>
          <span className="text-slate-200">connect</span>
          {[3, 4, 5, 6, 7, 8].map((d, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: d, repeat: Infinity, repeatType: "loop" }}
              className="text-blue-400">.</motion.span>
          ))}
        </motion.h1>

        <motion.h1
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="text-[30px] font-serif justify-start md:pl-9 pt-20 text-slate-300">
          Create Your Account <br />
          <span className="text-slate-500">or</span> <br />
          <span className="text-slate-300">Sign in</span>{" "}
          <span className="text-slate-600">— — — — — —</span>
        </motion.h1>
      </div>

      {/* Right — white form card */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full sm:w-96 flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">W</span>
          </div>
          <span className="text-gray-900 font-bold text-base tracking-tight">Wconnect</span>
        </div>

        <h2 className="text-gray-900 font-bold text-xl mb-1">
          {state === 'signup' ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-gray-400 text-xs mb-6">
          {state === 'signup' ? 'Sign up to get started for free' : 'Sign in to your workspace'}
        </p>

        <form onSubmit={onSubmitHandle} className="space-y-3">
          {state === 'signup' && (
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
              <input type="text" placeholder="Your full name" value={name}
                onChange={e => setName(e.target.value)} required className={inputCls} />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Password</label>
              {state === 'login' && (
                <span onClick={() => navigate('/reset-password')}
                  className="text-[10px] text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
                  Forgot password?
                </span>
              )}
            </div>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required className={inputCls} />
          </div>

          <button type="submit"
            className="w-full py-2.5 mt-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
            {state === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          {state === 'signup' ? (
            <p className="text-xs text-gray-400">Already have an account?{' '}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold"
                onClick={() => setState('login')}>Sign in</span>
            </p>
          ) : (
            <p className="text-xs text-gray-400">Don't have an account?{' '}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold"
                onClick={() => setState('signup')}>Sign up free</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
