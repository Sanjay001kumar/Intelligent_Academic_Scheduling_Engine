// components/OverviewTab.tsx

"use client";

import React from "react";
import { Faculty, Student, Course, Venue, GeneratedTimetable } from "@/types";

interface OverviewTabProps {
  faculties: Faculty[];
  students: Student[];
  courses: Course[];
  venues: Venue[];
  timetables: GeneratedTimetable[];
}

export default function OverviewTab({
  faculties,
  students,
  courses,
  venues,
  timetables,
}: OverviewTabProps) {
  const stats = [
    { label: "Total Faculties", value: faculties.length, icon: "👨‍🏫", color: "text-blue-400" },
    { label: "Total Students", value: students.length, icon: "👨‍🎓", color: "text-green-400" },
    { label: "Total Courses", value: courses.length, icon: "📚", color: "text-yellow-400" },
    { label: "Total Venues", value: venues.length, icon: "🏢", color: "text-purple-400" },
    { label: "Generated Timetables", value: timetables.length, icon: "📅", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="text-4xl opacity-80">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
