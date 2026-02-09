"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage";
import { Student } from "@/types";
import ViewModal from "@/components/ui/ViewModal";

export default function StudentsTab({
  students = [],
  setStudents,
}: {
  students?: Student[];
  setStudents: (s: Student[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    program: '',
    semester: 1,
    enrolledCourses: '',
  });

  const handleDeleteStudent = (studentId: string) => {
    const storage = StorageService.getInstance();
    storage.deleteStudent(studentId);
    setStudents(storage.getStudents() ?? []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storage = StorageService.getInstance();
    storage.addStudent({
      ...formData,
      enrolledCourses: formData.enrolledCourses.split(',').map((s) => s.trim()),
    });
    setStudents(storage.getStudents() ?? []);
    setFormData({ name: '', rollNumber: '', program: '', semester: 1, enrolledCourses: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Student Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>
      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Student Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="text" placeholder="Roll Number" value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="text" placeholder="Program" value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" required />
            <input type="number" placeholder="Semester" value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white" min={1} required />
            <input type="text" placeholder="Enrolled Courses (comma-separated)" value={formData.enrolledCourses} onChange={e => setFormData({ ...formData, enrolledCourses: e.target.value })} className="px-4 py-3 bg-black/50 border border-gray-600 rounded text-white col-span-full" required />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors duration-200 col-span-full">Add Student</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(students ?? []).map((student) => (
          <div key={student.id} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 relative flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">{student.name}</h3>
            <p className="text-gray-400 text-sm mb-1">Roll: {student.rollNumber}</p>
            <p className="text-gray-400 text-sm mb-1">Program: {student.program}</p>
            <p className="text-gray-400 text-sm">Semester: {student.semester}</p>
            <div className="mt-auto flex space-x-2 pt-4">
              <button onClick={() => setViewStudent(student)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">View</button>
              <button onClick={() => handleDeleteStudent(student.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors duration-200" title="Delete Student">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ViewModal
        item={viewStudent}
        onClose={() => setViewStudent(null)}
        renderDetails={(student: Student) => (
          <>
            <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
            <p><strong>Roll Number:</strong> {student.rollNumber}</p>
            <p><strong>Program:</strong> {student.program}</p>
            <p><strong>Semester:</strong> {student.semester}</p>
            <p><strong>Enrolled Courses:</strong> {student.enrolledCourses.join(', ')}</p>
          </>
        )}
      />
    </>
  );
}
