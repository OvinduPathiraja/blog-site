import React from 'react';
import { assets } from '../../assets/assets';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;

    // 🔁 Navigate FIRST
    navigate('/');

    // ⏱ Then clear token AFTER a delay
    setTimeout(() => {
      setToken(null);
    }, 100); // delay just enough to let the navigation complete
  };

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img
          src={assets.logo}
          alt="Logo"
          className='w-12 sm:w-12 cursor-pointer'
          onClick={() => navigate('/')}
        />
        <button
          onClick={logout}
          className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'
        >
          Logout
        </button>
      </div>

      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
