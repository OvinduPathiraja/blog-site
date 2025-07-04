import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { navigate, token } = useAppContext();

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className='w-12 sm:w-16 cursor-pointer'
      />
      {/* <button
        onClick={() => navigate(token ? '/admin' : '/login')}
        className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'
      >
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} className='w-3' alt="arrow" />
      </button> */}
      {token ? 'Dashboard' : 'Login'}
    </div>
  );
};

export default Navbar;
