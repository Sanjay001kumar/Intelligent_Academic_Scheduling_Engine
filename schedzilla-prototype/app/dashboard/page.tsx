"use client";

import React, { useState, useEffect } from 'react';

// --- SELF-CONTAINED AUTH & STORAGE SERVICES ---
// These services must be identical to the ones on the generator page
// to ensure they read and write to the same place in the browser's storage.
class AuthService {
    private static instance: AuthService;
    public static getInstance = (): AuthService => { if (!AuthService.instance) { AuthService.instance = new AuthService(); } return AuthService.instance; };
    public isAuthenticated = (): boolean => (typeof window !== 'undefined') ? !!localStorage.getItem('user-token') : false;
}

class StorageService {
    private static instance: StorageService;
    private readonly TIMETABLES_KEY = 'schedzilla-timetables';
    public static getInstance = (): StorageService => { if (!StorageService.instance) { StorageService.instance = new StorageService(); } return StorageService.instance; };
    public getTimetables = (): any[] => (typeof window !== 'undefined') ? JSON.parse(localStorage.getItem(this.TIMETABLES_KEY) || '[]') : [];
    public deleteTimetable = (id: string) => {
        if (typeof window !== 'undefined') {
            const timetables = this.getTimetables().filter((tt: any) => tt.id !== id);
            localStorage.setItem(this.TIMETABLES_KEY, JSON.stringify(timetables));
        }
    }
}
// --- END SERVICES ---

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!AuthService.getInstance().isAuthenticated()) {
      window.location.href = '/login';
    } else {
      // Load the saved timetables from localStorage when the page opens
      setTimetables(StorageService.getInstance().getTimetables());
      setLoading(false);
    }
  }, []);

  const handleDownload = async (timetable: any, format: 'pdf' | 'excel') => {
    setDownloading(`${timetable.id}-${format}`);
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/download-pdf-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: timetable.name, entries: timetable.entries }),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.error || `Failed to download ${format}.`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${timetable.name.replace(/ /g, '_') || 'timetable'}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch(err: any) {
        alert(`Download Error: ${err.message}`);
    } finally {
        setDownloading(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this timetable? This cannot be undone.")) {
        StorageService.getInstance().deleteTimetable(id);
        // Update the state to immediately reflect the change in the UI
        setTimetables(timetables.filter(tt => tt.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-16"><p className="text-slate-700 animate-pulse">Loading Dashboard...</p></div>;
  }

  return (
    // This content will be centered by the main layout.tsx file.
    <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">My Timetables</h1>
          <a href="/generator" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md">
            + Generate New
          </a>
        </div>

        {timetables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timetables.map(tt => (
              <div key={tt.id} className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <h2 className="text-xl font-bold text-blue-900 truncate">{tt.name}</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Created on: {tt.createdAt ? new Date(tt.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <div className="mt-auto grid grid-cols-3 gap-2">
                  <button onClick={() => handleDownload(tt, 'pdf')} disabled={!!downloading} className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50">
                    {downloading === `${tt.id}-pdf` ? '...' : 'PDF'}
                  </button>
                  <button onClick={() => handleDownload(tt, 'excel')} disabled={!!downloading} className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50">
                     {downloading === `${tt.id}-excel` ? '...' : 'Excel'}
                  </button>
                  <button onClick={() => handleDelete(tt.id)} disabled={!!downloading} className="w-full px-3 py-2 bg-slate-400 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
            <h2 className="text-xl font-semibold text-blue-900">No Timetables Found</h2>
            <p className="text-slate-600 mt-2">Click "Generate New" to upload your first schedule.</p>
          </div>
        )}
      </div>
  );
}

