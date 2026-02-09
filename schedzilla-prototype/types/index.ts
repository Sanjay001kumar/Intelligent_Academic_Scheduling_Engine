export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
  maxHoursPerWeek: number;
  availableSlots: TimeSlot[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  program: string;
  semester: number;
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'theory' | 'practical' | 'hybrid';
  duration: number; // in hours
  requiredVenues: string[];
  faculty: string;
  enrolledStudents: number;
}

export interface Venue {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'auditorium';
  capacity: number;
  facilities: string[];
  availability: TimeSlot[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface TimetableEntry {
  id: string;
  course: string;
  faculty: string;
  venue: string;
  timeSlot: string;
  students: number;

}

export interface GeneratedTimetable {
  id: string;
  name: string;
  createdAt: string;
  entries: TimetableEntry[];
  semester: string;
  academicYear: string;
}