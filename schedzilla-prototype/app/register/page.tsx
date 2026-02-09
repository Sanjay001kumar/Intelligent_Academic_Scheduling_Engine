"use client";

import React, { useState, useEffect } from 'react';

// --- SELF-CONTAINED AUTH SERVICE ---
// This class handles all user creation and session logic.
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

    private setUsers = (users: any[]): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    }

    public isAuthenticated = (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(this.TOKEN_KEY);
    }
    
    // This function adds a new user to the list in localStorage.
    public register = (name: string, email: string, password: string): { success: boolean; message: string } => {
        if (!name || !email || !password) {
            return { success: false, message: 'All fields are required.' };
        }
        const users = this.getUsers();
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = { name, email, password };
        this.setUsers([...users, newUser]);
        return { success: true, message: 'Registration successful!' };
    }
}
// --- END AUTH SERVICE ---

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = AuthService.getInstance().register(name, email, password);
    
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
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Create Account</h1>
          <p className="text-slate-600">Join Schedzilla and tame your schedules</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Enter your full name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Create a password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Confirm your password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50">{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>
        <p className="mt-6 text-center text-slate-600">Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in here</a></p>
      </div>
    </div>
  );
}

