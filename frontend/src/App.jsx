import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import ProfilePage from './pages/ProfiePage';
import { AppContent } from './context/AppContext';




const App = () => {

  const navigate = useNavigate()
  const {isLoggedin} = useContext(AppContent)
  return (
    <div >
      <ToastContainer />
     <Routes>
       {/* isLoggedin ? <Home/> : <Navigate to='/login' /> */}
      <Route path='/' element={ <Home /> }  />
      <Route path='/login' element={<Login/>} /> 
      <Route path='/email-verify' element={<EmailVerify/>}/> 
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/profile' element={isLoggedin ? <ProfilePage/> : <Navigate to='/login' />}/> 
     </Routes>
    </div>
  )
}

export default App;

