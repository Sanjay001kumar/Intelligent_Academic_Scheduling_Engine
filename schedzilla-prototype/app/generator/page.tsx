"use client";

import React, { useState } from 'react';

// --- SELF-CONTAINED STORAGE SERVICE ---
// This service will save timetables to the browser's localStorage.
class StorageService {
    private static instance: StorageService;
    private readonly TIMETABLES_KEY = 'schedzilla-timetables';
    public static getInstance = (): StorageService => { if (!StorageService.instance) { StorageService.instance = new StorageService(); } return StorageService.instance; };
    public getTimetables = (): any[] => (typeof window !== 'undefined') ? JSON.parse(localStorage.getItem(this.TIMETABLES_KEY) || '[]') : [];
    public addTimetable = (timetable: any) => {
        if (typeof window !== 'undefined') {
            const timetables = this.getTimetables();
            localStorage.setItem(this.TIMETABLES_KEY, JSON.stringify([...timetables, timetable]));
        }
    }
}
// --- END STORAGE SERVICE ---

export default function Generator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timetableName, setTimetableName] = useState('My Timetable');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setSessionId(null); // Reset session on new file
      setError(null);
    }
  };

  const handleProcessFile = async () => {
    setError(null);
    if (!selectedFile) { setError('Please select an Excel file first.'); return; }
    if (!timetableName.trim()) { setError('Please provide a name for the timetable.'); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('timetableFile', selectedFile);
    try {
      const response = await fetch('http://127.0.0.1:5001/api/process-excel', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.error || 'Failed to process file.'); }
      
      // Keep the session ID for the generator's own download buttons
      setSessionId(result.session_id);

      // --- SEAMLESSLY SAVE TO DASHBOARD IN THE BACKGROUND ---
      const newTimetable = {
        id: Date.now().toString(),
        name: timetableName,
        createdAt: new Date().toISOString(),
        entries: result.data, // Use the data returned from the backend
      };
      StorageService.getInstance().addTimetable(newTimetable);
      // NO REDIRECT - user stays on this page

    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'excel') => {
    if (!sessionId) { setError("No processed file found."); return; }
    // Use the session-based download URL, which works with your current app.py
    const url = `http://127.0.0.1:5001/api/download-pdf-session/${sessionId}?name=${encodeURIComponent(timetableName)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) { throw new Error((await response.json()).error || `Failed to download ${format}.`); }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const extension = format === 'excel' ? 'xlsx' : 'pdf';
        a.download = `${timetableName.replace(/ /g, '_') || 'timetable'}.${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch(err: any) {
        setError(err.message);
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setSessionId(null);
    setError(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-900">Timetable Generator</h1>
            <p className="text-slate-600 mb-8">Upload your Excel schedule to optimize and download it. It will be automatically saved to your dashboard.</p>
        </div>
        
        {sessionId ? (
            <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-center text-green-600">File Processed & Saved!</h3>
                <p className="text-center text-slate-700">You can now download "<span className="font-medium">{timetableName}</span>" or find it on your dashboard.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button onClick={() => handleDownload('pdf')} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200">Download as PDF</button>
                    <button onClick={() => handleDownload('excel')} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-200">Download as Excel</button>
                </div>
                <button onClick={handleReset} className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">Process Another File</button>
            </div>
        ) : (
            <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-blue-200">
              <input type="text" className="w-full p-3 rounded bg-white border border-blue-100 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-slate-400" placeholder="Enter a name for your timetable" value={timetableName} onChange={e => setTimetableName(e.target.value)} />
              <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
              <button onClick={handleProcessFile} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"> {loading ? 'Processing...' : 'Generate & Save'} </button>
              {error && <p className="text-red-700 mt-4 bg-red-50 p-3 rounded border border-red-200">{error}</p>}
            </div>
        )}
      </div>
  );
}

