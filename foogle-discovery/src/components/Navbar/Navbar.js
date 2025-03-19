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
      <nav aria-label='Main Navigation' className='navbar'>
        <div className="logo" onClick={() => navigate('')}>Foogle</div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className='user-info'>
              <span>welcome, {username}</span>
              <button className='username' onClick={()=>navigate('Profile/saved_recipes')}>Profile</button>
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

      <div className="layout-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <ul>
            <li onClick={() => navigate('')}>🏠 Home</li>
            <li onClick={() => navigate('/search')}>🔍 Search</li>
            <li onClick={() => navigate('/notifications')}>🔔 Notifications</li>
            <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
          </ul>
        </aside>

        {/* Main Content Section */}
        <main className="main-content">
          <h2>🍽️ Craving Something Delicious? Find the Perfect Recipe! 🍳</h2>
          <p>🔍 <strong>Search. Cook. Enjoy.</strong> Whether you're a pro chef or a kitchen newbie, we’ve got the perfect recipe waiting for you!</p>
          <p>🍕 <strong>Craving a Specific Dish?</strong> Search for it now!</p>
            <li>🔥 <strong>Why You'll Love Us:</strong></li>
            <li>✅ Thousands of recipes at your fingertips</li>
            <li>✅ Easy-to-follow instructions</li>
            <li>✅ Filters for diet, time, and ingredients</li>
          
          <p>🥑 <strong>No idea what to cook?</strong> Let us surprise you with a random recipe!</p>
          <p>📢 <strong>Start Your Flavor Adventure Now!</strong> 🍕🍰</p>
          <a href="/search" className="cta-button">🔗 Click Here & Find Your Next Favorite Meal!</a>
        </main>

        {/* Widgets Section */}
        <section className="widgets">
          <h3>📜 Did You Know?</h3>
          <p>
            The oldest known cookbook, <strong>Apicius</strong>, dates back to the 4th or 5th century AD in Ancient Rome.
            It contains recipes for exotic dishes like flamingo! 🦩
          </p>
        </section>
    </div>


    </React.Fragment>
  );
};

export default Navbar;