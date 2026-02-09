"use client";

import React, { useState, useEffect } from 'react';

// --- SELF-CONTAINED AUTH SERVICE ---
// This service, included directly in the Navbar, handles all authentication logic.
class AuthService {
    private static instance: AuthService;
    private readonly TOKEN_KEY = 'user-token';

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public isAuthenticated = (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    public getCurrentUser = (): { name: string; email: string } | null => {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem(this.TOKEN_KEY);
        return token ? JSON.parse(token) : null;
    }

    public logout = (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            window.location.href = '/login';
        }
    }
}
// --- END AUTH SERVICE ---

// Define a type for the user object
type User = {
  name: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // When the component loads, check for a logged-in user
    const currentUser = AuthService.getInstance().getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    AuthService.getInstance().logout();
  };

  return (
    <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span className="text-3xl">⚙️</span>
            Schedzilla
          </a>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-700 font-medium">Welcome, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="px-4 py-2 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  Login
                </a>
                <a href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
