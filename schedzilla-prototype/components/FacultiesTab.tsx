"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage";
import { Faculty } from "@/types";

export default function FacultiesTab({
  faculties = [],
  setFaculties,
}: {
  faculties?: Faculty[];
  setFaculties: (f: Faculty[]) => void;
}) {
  const [viewFaculty, setViewFaculty] = useState<Faculty | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    expertise: '',
    maxHoursPerWeek: 20,
    availableSlots: '', // comma-separated string
  });

  const handleDeleteFaculty = (facultyId: string) => {
    const storage = StorageService.getInstance();
    storage.deleteFaculty(facultyId);
    setFaculties(faculties.filter(f => f.id !== facultyId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storage = StorageService.getInstance();
    const newFaculty = storage.addFaculty({
      ...formData,
      expertise: formData.expertise.split(',').map(s => s.trim()),
      availableSlots: formData.availableSlots.split(',').map(s => s.trim()),
    });
    setFaculties([...faculties, newFaculty]);
    setFormData({ name: '', email: '', department: '', expertise: '', maxHoursPerWeek: 20, availableSlots: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Faculty Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {viewFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setViewFaculty(null)}>
          <div className="bg-[#141820] text-white p-6 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{viewFaculty.name}</h2>
            <p><strong>Email:</strong> {viewFaculty.email}</p>
            <p><strong>Department:</strong> {viewFaculty.department}</p>
            <p><strong>Expertise:</strong> {viewFaculty.expertise.join(', ')}</p>
            <p><strong>Max Hours per Week:</strong> {viewFaculty.maxHoursPerWeek}</p>
            <p><strong>Available Slots:</strong> {viewFaculty.availableSlots.join(', ')}</p>
            <button onClick={() => setViewFaculty(null)} className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Faculty Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="text" placeholder="Department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="text" placeholder="Expertise (comma-separated)" value={formData.expertise} onChange={e => setFormData({ ...formData, expertise: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="number" placeholder="Max Hours Per Week" value={formData.maxHoursPerWeek} onChange={e => setFormData({ ...formData, maxHoursPerWeek: parseInt(e.target.value) })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" min="1" max="40" required />
            <input type="text" placeholder="Available Slots (comma-separated)" value={formData.availableSlots} onChange={e => setFormData({ ...formData, availableSlots: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white col-span-full" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors duration-200 col-span-full">Add Faculty</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculties.map(faculty => (
          <div key={faculty.id} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 relative flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">{faculty.name}</h3>
            <p className="text-gray-400 text-sm mb-1">{faculty.email}</p>
            <p className="text-gray-400 text-sm mb-1">Dept: {faculty.department}</p>
            <p className="text-gray-400 text-sm mb-1">Max Hours: {faculty.maxHoursPerWeek}/week</p>
            <p className="text-gray-400 text-sm">Available Slots: {faculty.availableSlots.join(', ')}</p>
            <div className="mt-auto flex space-x-2 pt-4">
              <button onClick={() => setViewFaculty(faculty)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">View</button>
              <button onClick={() => handleDeleteFaculty(faculty.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors duration-200" title="Delete Faculty">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
