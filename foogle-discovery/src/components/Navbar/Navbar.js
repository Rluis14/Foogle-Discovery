import React, {useContext, useEffect, useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { signIn } from '../../API/api';
import { signUp } from '../../API/api';
import {auth, db} from '../../firebase';
import {doc, getDoc} from 'firebase/firestore';
import './Navbar.css';
import MainContent from '../MainContent/MainContent';
import Login from '../../Page/Login/login';
import Signup from '../../Page/Signup/signup';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useContext(AuthContext)
  // check is user is already logged in 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      let name = null;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if(userDoc.exists()) {
          name = userDoc.data().username;
        } else {
          name = user.email;
        }
        setIsLoggedIn(true);
        setUser(name);
      } else {
        setIsLoggedIn(false);
        setUsername(null);
        name = '';
      }
      setUsername(name);
    });

    return unsubscribe;
  }, []);

  // handle login
  const handleLogin = async () => {
    try {
      const user = await signIn(email, password); // call your signin function

      //fetch user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if(userDoc.exists()) {
        setUsername(userDoc.data().username); // this sets username from firestone 
      } else {
        setUsername(user.email); // fallback to email if username does not exist
      }
      setIsLoggedIn(true);
      navigate(''); // Navigate to home after login 
    } catch (error) {
      console.error('Login failed', error.message);
      alert('Login failed' + error.message);
    }
  };

  // handle signup
  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password, username); // call your signup function
      // save user data to firestore
      await getDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
      });
      setUsername(username);
      setIsLoggedIn(true);
      navigate(''); // Navigate to home after signup
      } catch (error) {
        console.error('Signup failed', error.message);
        alert('Signup failed' + error.message);
      }
  };

    // Handle logout
    const handleLogout = async () => {
      try {
        await auth.signOut(); // Sign out using Firebase Auth
        setIsLoggedIn(false);
        setUsername('');
        navigate('/'); // Navigate to home after logout
      } catch (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
      }
    };

  return (
    <React.Fragment>
      <nav>
        <div className="logo" onClick={() => navigate('')}>Foogle</div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className='user-info'>
              <span>welcome, {username}</span>
              <button className='username' onClick={()=>navigate('Profile')}>Profile</button>
              <button className='logout' onClick={handleLogout}>Logout</button>
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