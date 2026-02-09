"use client";

import React, { useState, useEffect } from 'react';

// --- SELF-CONTAINED AUTH SERVICE ---
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
        if (!token) return null;
        try {
            return JSON.parse(token);
        } catch (error) {
            console.error("Failed to parse user token:", error);
            localStorage.removeItem(this.TOKEN_KEY);
            return null;
        }
    }

    public logout = (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            window.location.href = '/login';
        }
    }
}
// --- END AUTH SERVICE ---

type User = {
  name: string;
  email: string;
};

// --- NAVBAR COMPONENT WITH HYDRATION FIX AND CENTERED NAVIGATION ---
function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentUser = AuthService.getInstance().getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    AuthService.getInstance().logout();
  };

  return (
    <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* THE FIX: The navbar is now a three-column grid for perfect centering */}
        <div className="flex justify-between items-center py-4">

          {/* Left Section: Logo */}
          <div className="flex-1 flex justify-start">
            <a href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              Schedzilla
            </a>
          </div>
          
          {/* Center Section: Navigation Links */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            <a href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">Home</a>
            <a href="/generator" className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">Generator</a>
            <a href="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">Dashboard</a>
            <a href="/about" className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">About</a>
          </nav>
          
          {/* Right Section: User Info / Auth Buttons */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {isClient ? (
              user ? (
                <>
                  <span className="hidden sm:inline text-slate-700 font-medium">Welcome, {user.name}!</span>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200">Logout</button>
                </>
              ) : (
                <>
                  <a href="/login" className="px-4 py-2 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">Login</a>
                  <a href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md">Register</a>
                </>
              )
            ) : (
              <div className="h-10 w-48 bg-blue-100 rounded-lg animate-pulse"></div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

// --- ROOT LAYOUT ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Schedzilla</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

