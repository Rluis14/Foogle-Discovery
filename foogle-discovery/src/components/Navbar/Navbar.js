import React, {useContext, useEffect, useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const {user,logout} = useContext(AuthContext)
  const isLoggedIn = Boolean(user);

  return (
    <React.Fragment>
      <nav>
        <div className="logo" onClick={() => navigate('')}>Foogle</div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className='user-info'>
              <span>welcome, {user.user_name}</span>
              <button className='username' onClick={()=>navigate('Profile/saved_recipes')}>Profile</button>
              <button className='logout' onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className='auth-buttons'>
              <button className="login" onClick={()=>navigate('Login')}>Login</button>
              <button className="signup" onClick={()=>navigate('Signup')}>Sign Up</button>
            </div>
          )}
        </div>  
      </nav>
      <Outlet />
    </React.Fragment>
  );
};

export default Navbar;