import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const STORAGE_KEY = 'marjane-auth';

// Demo users for testing
const DEMO_USERS = {
  admin: {
    id: '1',
    email: 'admin@marjane.com',
    password: 'admin',
    name: 'Admin User',
    role: 'admin' as const
  },
  user: {
    id: '2',
    email: 'user@marjane.com',
    password: 'user',
    name: 'Regular User',
    role: 'user' as const
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [user]);

  const login = useCallback((email: string, password: string): boolean => {
    try {
      // Check admin credentials
      if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
        const { password: _, ...adminUser } = DEMO_USERS.admin;
        setUser(adminUser);
        return true;
      }
      
      // Check regular user credentials
      if (email === DEMO_USERS.user.email && password === DEMO_USERS.user.password) {
        const { password: _, ...regularUser } = DEMO_USERS.user;
        setUser(regularUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }, []);

  const register = useCallback((email: string, password: string, name: string): boolean => {
    try {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'user'
      };
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  return {
    user,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin'
  };
}