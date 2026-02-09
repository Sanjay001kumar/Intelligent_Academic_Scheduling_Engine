"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage";
import { Venue , TimeSlot } from "@/types"; 
function parseTimeSlot(slotStr: string): TimeSlot | null {
  const parts = slotStr.split("-");
  if (parts.length !== 3) return null;

  return {
    day: parts[0],
    startTime: parts[1],
    endTime: parts[2],
  };
}

export default function VenuesTab({
  venues = [],
  setVenues,
  facultySlots = [],
}: {
  venues?: Venue[];
  setVenues: (v: Venue[]) => void;
  facultySlots: TimeSlot[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [viewVenue, setViewVenue] = useState<Venue | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'classroom' as 'classroom' | 'lab' | 'auditorium',
    capacity: 50,
    facilities: '',
  });

  const handleDeleteVenue = (venueId: string) => {
    const storage = StorageService.getInstance();
    storage.deleteVenue(venueId);
    setVenues(venues.filter(v => v.id !== venueId));
  };

  const handleAvailabilityChange = (slot: string) => {
    setSelectedAvailability(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storage = StorageService.getInstance();
    const newVenue = storage.addVenue({
      ...formData,
      facilities: formData.facilities.split(',').map(s => s.trim()),
      availability: selectedAvailability,
    });
    setVenues([...venues, newVenue]);
    setFormData({ name: '', type: 'classroom', capacity: 50, facilities: '' });
    setSelectedAvailability([]);
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Venue Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          {showForm ? 'Cancel' : 'Add Venue'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Venue Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as 'classroom' | 'lab' | 'auditorium' })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            >
              <option value="classroom">Classroom</option>
              <option value="lab">Lab</option>
              <option value="auditorium">Auditorium</option>
            </select>
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min={1}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <input
              type="text"
              placeholder="Facilities (comma-separated)"
              value={formData.facilities}
              onChange={e => setFormData({ ...formData, facilities: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white col-span-full"
              required
            />

            <div className="col-span-full">
              <label className="block mb-1 text-white font-semibold">Available Slots</label>
              <div className="max-h-48 overflow-auto bg-black/50 border border-gray-600 rounded p-2 flex flex-wrap gap-2">
                {facultySlots.length === 0 && <p className="text-gray-400">No slots available from faculties.</p>}
                {facultySlots.map((slot , index) => (
                  <label key={index} className="inline-flex items-center cursor-pointer space-x-2 bg-gray-800 px-3 py-1 rounded select-none">
                <input
                  type="checkbox"
                  value={slot}
                  checked={selectedAvailability.includes(slot)}
                  onChange={() => handleAvailabilityChange(slot)}
                  className="form-checkbox text-blue-500"
                />
                <span className="text-white text-sm">{slot}</span>
              </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors duration-200 col-span-full"
            >
              Add Venue
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map(venue => (
          <div key={venue.id} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 relative flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">{venue.name}</h3>
            <p className="text-gray-400 text-sm mb-1">Type: {venue.type}</p>
            <p className="text-gray-400 text-sm mb-1">Capacity: {venue.capacity}</p>
            <p className="text-gray-400 text-sm mb-1">Facilities: {venue.facilities.join(', ')}</p>
            <p className="text-gray-400 text-sm">Available Slots: {venue.availability.join(', ')}</p>
            <div className="mt-auto flex space-x-2 pt-4">
              <button onClick={() => setViewVenue(venue)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">View</button>
              <button onClick={() => handleDeleteVenue(venue.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors duration-200" title="Delete Venue">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setViewVenue(null)}>
          <div className="bg-[#141820] text-white p-6 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{viewVenue.name}</h2>
            <p><strong>Type:</strong> {viewVenue.type}</p>
            <p><strong>Capacity:</strong> {viewVenue.capacity}</p>
            <p><strong>Facilities:</strong> {viewVenue.facilities.join(', ')}</p>
            <p><strong>Available Slots:</strong> {viewVenue.availability.join(', ')}</p>
            <button onClick={() => setViewVenue(null)} className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
