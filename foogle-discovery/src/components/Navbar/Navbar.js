import { Outlet, useNavigate } from 'react-router-dom';
import React from 'react';
import './Navbar.css';
import MainContent from '../MainContent/MainContent';
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
    <nav>
      <div className="logo" onClick={()=>navigate('')}>Foogle</div>
      <div className="auth-buttons">
        <button className="login" onClick={()=>navigate('login')}>Login</button>
        <button className="signup" onClick={()=>navigate('signup')}>Sign Up</button>
      </div>
    </nav>
    <Outlet/>
    </React.Fragment>
  );
};

export default Navbar;