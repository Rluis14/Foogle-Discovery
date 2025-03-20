import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import './login.css'; // Ensure you have this CSS file
import { signIn } from '../../API/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setUser} = useContext(AuthContext)
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Client-side validation
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Firebase authentication
      console.log("Attempting to log in with:", email); 
      const [res,error] = await signIn(email, password);
      // console.log("Login successful:", userCredential.user);
      if(error) throw error;
      const {token,user} = res;
      setUser(user);
      localStorage.setItem('token', token);
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      // Handle different error types
      console.log(error);
      setError(error.response?.data?.error || 'Failed to login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back to Foogle</h2>
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
            'Login'
          )}
        </button>
        
        <div className="auth-link">
          New user? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;