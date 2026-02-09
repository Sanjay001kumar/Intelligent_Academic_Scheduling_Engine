"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage";
import { Course, Faculty } from "@/types";
import ViewModal from "@/components/ui/ViewModal";

export default function CoursesTab({
  courses = [],
  setCourses,
  faculties = [],
}: {
  courses?: Course[];
  setCourses: (c: Course[]) => void;
  faculties?: Faculty[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    type: 'theory' as 'theory' | 'practical' | 'hybrid',
    duration: 1,
    requiredVenues: '',
    faculty: '',
    enrolledStudents: 0,
  });

  const handleDeleteCourse = (courseId: string) => {
    const storage = StorageService.getInstance();
    storage.deleteCourse(courseId);
    setCourses(storage.getCourses() ?? []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storage = StorageService.getInstance();
    storage.addCourse({
      ...formData,
      requiredVenues: formData.requiredVenues.split(',').map(s => s.trim()),
      faculty: formData.faculty,
    });
    setCourses(storage.getCourses() ?? []);
    setFormData({
      name: '',
      code: '',
      credits: 3,
      type: 'theory',
      duration: 1,
      requiredVenues: '',
      faculty: '',
      enrolledStudents: 0,
    });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Course Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <input
              type="text"
              placeholder="Course Code"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <input
              type="number"
              placeholder="Credits"
              value={formData.credits}
              onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              min={1}
              max={6}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as 'theory' | 'practical' | 'hybrid' })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            >
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <input
              type="number"
              placeholder="Duration (hours)"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min={1}
              max={4}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <select
              value={formData.faculty}
              onChange={e => setFormData({ ...formData, faculty: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Required Venues (comma-separated)"
              value={formData.requiredVenues}
              onChange={e => setFormData({ ...formData, requiredVenues: e.target.value })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              required
            />
            <input
              type="number"
              placeholder="Enrolled Students"
              value={formData.enrolledStudents}
              onChange={e => setFormData({ ...formData, enrolledStudents: parseInt(e.target.value) })}
              className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white"
              min={0}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors duration-200 col-span-full"
            >
              Add Course
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(courses ?? []).map((course) => (
          <div key={course.id} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 relative flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">{course.name}</h3>
            <p className="text-gray-400 text-sm mb-1">Code: {course.code}</p>
            <p className="text-gray-400 text-sm mb-1">Credits: {course.credits}</p>
            <p className="text-gray-400 text-sm mb-1">Type: {course.type}</p>
            <p className="text-gray-400 text-sm mb-1">Faculty: {faculties.find(f => f.id === course.faculty)?.name || 'N/A'}</p>
            <p className="text-gray-400 text-sm">Enrolled Students: {course.enrolledStudents}</p>
            <div className="mt-auto flex space-x-2 pt-4">
              <button onClick={() => setViewCourse(course)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">View</button>
              <button onClick={() => handleDeleteCourse(course.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors duration-200" title="Delete Course">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ViewModal
        item={viewCourse}
        onClose={() => setViewCourse(null)}
        renderDetails={(course: Course) => (
          <>
            <h2 className="text-2xl font-bold mb-4">{course.name}</h2>
            <p><strong>Code:</strong> {course.code}</p>
            <p><strong>Credits:</strong> {course.credits}</p>
            <p><strong>Type:</strong> {course.type}</p>
            <p><strong>Faculty:</strong> {faculties.find(f => f.id === course.faculty)?.name || 'N/A'}</p>
            <p><strong>Required Venues:</strong> {course.requiredVenues.join(', ')}</p>
            <p><strong>Enrolled Students:</strong> {course.enrolledStudents}</p>
          </>
        )}
      />
    </>
  );
}
