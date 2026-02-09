"use client";

import React, { useState } from "react";
import { StorageService } from "@/lib/storage";
import { GeneratedTimetable, Faculty, Course, Venue, TimetableEntry } from "@/types";
import ViewModal from "@/components/ui/ViewModal";
import { generateTimetable, ScheduledEntry } from "@/lib/timetableGenerator";

export default function TimetablesTab({
  timetables = [],
  setTimetables,
  faculties = [],
  courses = [],
  venues = [],
}: {
  timetables?: GeneratedTimetable[];
  setTimetables: (t: GeneratedTimetable[]) => void;
  faculties?: Faculty[];
  courses?: Course[];
  venues?: Venue[];
}) {
  const [viewTimetable, setViewTimetable] = useState<GeneratedTimetable | null>(null);

  const handleGenerateTimetable = () => {
    const mappedFaculties = faculties.map(f => ({
      name: f.name,
      availableSlots: (f.availableSlots ?? []).map(slot => slot.toString()),
      maxHoursPerWeek: f.maxHoursPerWeek,
    }));

    const mappedVenues = venues.map(v => ({
      name: v.name,
      capacity: v.capacity,
      availability: (v.availability ?? []).map(slot => slot.toString()),
    }));

    const mappedCourses = courses.map(c => ({
      name: c.name,
      code: c.code,
      duration: c.duration,
      faculty: faculties.find(f => f.name === c.faculty)?.name || "",
      requiredVenues: c.requiredVenues,
      enrolledStudents: c.enrolledStudents,
    }));

    const generatedEntries: ScheduledEntry[] = generateTimetable(
      mappedCourses,
      mappedFaculties,
      mappedVenues
    );

    const mappedEntries: TimetableEntry[] = generatedEntries.map((entry, index) => ({
      id: `entry_${index}`,
      course: entry.course,
      faculty: entry.faculty,
      venue: entry.venue,
      timeSlot: entry.slot,
      students: courses.find(c => c.name === entry.course)?.enrolledStudents || 0,
    }));

    const newTimetable: GeneratedTimetable = {
      id: `tt_${Date.now()}`,
      name: `Generated Timetable ${new Date().toLocaleString()}`,
      academicYear: "2024-25",
      semester: "1",
      entries: mappedEntries,
      createdAt: new Date().toISOString(),
    };

    setTimetables([...timetables, newTimetable]);
    StorageService.getInstance().addTimetable(newTimetable);
  };

  const handleDeleteTimetable = (timetableId: string) => {
    const storage = StorageService.getInstance();
    storage.deleteTimetable(timetableId);
    setTimetables(timetables.filter(t => t.id !== timetableId));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Timetables Management</h2>
        <button onClick={handleGenerateTimetable} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200">
          Generate Timetable
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timetables.map(timetable => (
          <div key={timetable.id} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 relative flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">{timetable.name}</h3>
            <p className="text-gray-400 text-sm mb-1">Academic Year: {timetable.academicYear}</p>
            <p className="text-gray-400 text-sm mb-1">Semester: {timetable.semester}</p>
            <p className="text-gray-400 text-sm mb-1">Entries: {timetable.entries.length}</p>

            <div className="mt-auto flex space-x-2 pt-4">
              <button onClick={() => setViewTimetable(timetable)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200">
                View
              </button>
              <button onClick={() => handleDeleteTimetable(timetable.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors duration-200" title="Delete Timetable">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ViewModal
        item={viewTimetable}
        onClose={() => setViewTimetable(null)}
        renderDetails={timetable => (
          <>
            <h2 className="text-2xl font-bold mb-4">{timetable.name}</h2>
            <p><strong>Academic Year:</strong> {timetable.academicYear}</p>
            <p><strong>Semester:</strong> {timetable.semester}</p>
            <p><strong>Created At:</strong> {new Date(timetable.createdAt).toLocaleString()}</p>
            <p><strong>Scheduled Courses:</strong></p>
            <ul className="list-disc pl-6 max-h-64 overflow-auto">
              {timetable.entries.map(entry => (
                <li key={entry.id}>
                  <strong>{entry.course}</strong> — {entry.timeSlot} @ {entry.venue} (Faculty: {entry.faculty})
                </li>
              ))}
            </ul>
          </>
        )}
      />
    </>
  );
}
