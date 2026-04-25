import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

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
      if (pb.authStore.isValid) {
        try {
          // Attempt to refresh the auth token
          await pb.collection('users').authRefresh();
          setCurrentUser(pb.authStore.record);
        } catch (error) {
          // Token is likely invalid or expired
          pb.authStore.clear();
          setCurrentUser(null);
        }
      }
      setInitialLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setCurrentUser(authData.record);
      return authData;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email, password, passwordConfirm, name) => {
    try {
      const record = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name: name || ''
      });
      
      await pb.collection('users').authWithPassword(email, password);
      setCurrentUser(pb.authStore.record);
      
      return record;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = () => {
    pb.authStore.clear();
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