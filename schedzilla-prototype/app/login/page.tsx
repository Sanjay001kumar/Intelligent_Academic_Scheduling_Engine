"use client";

import React, { useState, useEffect } from 'react';

// --- SELF-CONTAINED AUTH SERVICE (FIXED) ---
class AuthService {
    private static instance: AuthService;
    private readonly USERS_KEY = 'schedzilla-users';
    private readonly TOKEN_KEY = 'user-token';

    public static getInstance(): AuthService {
        if (!AuthService.instance) { AuthService.instance = new AuthService(); }
        return AuthService.instance;
    }

    private getUsers = (): any[] => {
        if (typeof window === 'undefined') return [];
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    public isAuthenticated = (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    // CRITICAL FIX: This now finds the user and saves their NAME and EMAIL to the token.
    public login = (email: string, password: string): { success: boolean; message: string } => {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save the user's full details, not just a generic token
            localStorage.setItem(this.TOKEN_KEY, JSON.stringify({ name: user.name, email: user.email }));
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
    }
}
// --- END AUTH SERVICE ---

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (AuthService.getInstance().isAuthenticated()) {
      window.location.href = '/';
    } else {
      setIsAuthCheckComplete(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = AuthService.getInstance().login(email, password);
    if (result.success) {
      window.location.href = '/';
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (!isAuthCheckComplete) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-slate-700 text-xl animate-pulse">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-blue-100 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your Schedzilla account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50">{loading ? 'Signing In...' : 'Sign In'}</button>
        </form>
        <p className="mt-6 text-center text-slate-600">Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Create one here</a></p>
      </div>
    </div>
  );
}

