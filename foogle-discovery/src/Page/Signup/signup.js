import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import zxcvbn from 'zxcvbn';
import './signup.css';
import { signUp } from '../../API/api';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const {user,setUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Added missing password strength check function
  const checkPasswordStrength = (password) => {
    const result = zxcvbn (password);
    setPasswordScore(result.score);
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation checks
      if (!username.trim()) throw new Error('Username is required');
      if (username.length < 4) throw new Error('Username must be at least 4 characters');
      if (!validateEmail(email)) throw new Error('Please enter a valid email address');
      if (password !== confirmPassword) throw new Error('Passwords do not match');
      if (passwordScore < 2) throw new Error('Password is too weak');
      
      // Firebase operations
     const [res,error] = await signUp(email,password,username)
      if(error) throw error;

      setUser(res.user);
      localStorage.setItem('token', res.token);

      navigate('/'); // Redirect after successful signup

    } catch (error) {
      // Error handling
      setError(error.response?.data?.error || 'Failed to sign up');
    }
    setLoading(false);
  };

  const getBarColor = (score) => {
    const colors = ['#ff4444', '#ffbb33', '#00C851', '#00C851'];
    return colors[Math.min(score, colors.length - 1)];
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Join Foogle</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            minLength="4"
            maxLength="20"
            pattern="[a-zA-Z0-9_]+"
            title="Only letters, numbers, and underscores"
            required
          />
          <p className="input-hint">4-20 characters, letters, numbers, and underscores only</p>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            placeholder="Create a password"
            required
          />

          <div className="password-meter">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className={`strength-bar strength-${passwordScore}`}
                style={{ 
                  backgroundColor: getBarColor(passwordScore),
                  opacity: password ? 1 : 0.3
                }}
              ></div>
            ))}
          </div>
          {password && (
            <div className="strength-text">
              Password strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            'Sign Up'
          )}
        </button>
        
        <div className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;