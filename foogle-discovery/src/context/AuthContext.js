import { createContext, useState } from 'react';
import { auth } from '../firebase';
// Auth Context
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  }
  );
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


