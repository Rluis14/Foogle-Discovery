import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import './signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Added missing password strength check function
  const checkPasswordStrength = (password) => {
    const result = zxcvbn(password);
    setPasswordScore(result.score);
  };  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    

    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (zxcvbn(password).score < 2) {
        throw new Error('Password is too weak');
      }

      

    } catch (error) {
      // Handle Firebase errors specifically
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('Email already registered');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError(error.message);
      }
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
          {/* Moved password meter inside form-group */}
          <div className="password-meter">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className={`strength-bar ${passwordScore > i ? 'active' : ''}`}
                style={{ 
                  backgroundColor: getBarColor(passwordScore),
                  opacity: password ? 1 : 0.3
                }}
              ></div>
            ))}
          </div>
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
            'Sign Up' // Changed from 'Login' to 'Sign Up'
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