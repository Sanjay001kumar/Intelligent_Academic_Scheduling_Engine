"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.getInstance().isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-2 bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-600">
            SCHEDZILLA
          </h1>
          <p className="text-sm font-semibold text-blue-500 tracking-widest mb-8 uppercase">Smart Timetable Generation</p>

          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Transform scheduling chaos into perfect harmony. Our intelligent system 
            eliminates conflicts, optimizes resources, and creates balanced timetables 
            in seconds—not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={isAuthenticated ? "/generator" : "/login"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            
            {!isAuthenticated && (
              <Link
                href="/register"
                className="border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4 w-full">
          <div className="bg-white p-8 rounded-xl border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">Lightning Fast</h3>
            <p className="text-slate-600">Generate optimized timetables in seconds with our advanced algorithms.</p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">NEP 2020 Aligned</h3>
            <p className="text-slate-600">Fully compliant with National Education Policy requirements and standards.</p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">Smart Analytics</h3>
            <p className="text-slate-600">Advanced conflict resolution and resource optimization for perfect scheduling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
