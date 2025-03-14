import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // For Firestore
import { auth, db } from "../../firebase"; // Adjust the path as needed
import './login.css'; // Ensure you have this CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user);

      // Optional: Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
      } else {
        console.log("User data not found in Firestore");
      }

      // Redirect to home page after successful login
      navigate('/');

    } catch (error) {
      // Handle different error types
      console.error("Login error:", error);
      switch(error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('Account disabled');
          break;
        case 'auth/user-not-found':
          setError('User not found');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        default:
          setError(error.message || 'Failed to login');
      }
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