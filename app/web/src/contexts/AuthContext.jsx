import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const storedUser = localStorage.getItem('videovault_user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('videovault_user');
        }
      }
      setInitialLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you'd check passwords against a stored DB.
    // Here we just simulate login by trusting the email.
    const user = {
      id: email, // Using email as unique ID for simulation
      email: email,
      name: email.split('@')[0]
    };
    
    localStorage.setItem('videovault_user', JSON.stringify(user));
    setCurrentUser(user);
    return { record: user };
  };

  const signup = async (email, password, passwordConfirm, name) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password !== passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    const user = {
      id: email,
      email: email,
      name: name || email.split('@')[0]
    };
    
    localStorage.setItem('videovault_user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('videovault_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};