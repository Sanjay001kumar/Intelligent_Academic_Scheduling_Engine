"use client";

import { Faculty, Student, Course, Venue, GeneratedTimetable } from '@/types';

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  getFaculties(): Faculty[] {
    const data = localStorage.getItem('faculties');
    if (!data) return [];
    try {
      return JSON.parse(data) as Faculty[];
    } catch {
      return [];
    }
  }

  setFaculties(faculties: Faculty[]) {
    localStorage.setItem('faculties', JSON.stringify(faculties));
  }

  addFaculty(facultyData: Omit<Faculty, 'id'>): Faculty {
    const faculties = this.getFaculties();
    const newFaculty: Faculty = {
      id: Date.now().toString(), // simple unique ID generator
      ...facultyData,
    };
    const updated = [...faculties, newFaculty];
    this.setFaculties(updated);
    return newFaculty;
  }

  deleteFaculty(id: string) {
    const faculties = this.getFaculties();
    const updatedFaculties = faculties.filter(faculty => faculty.id !== id);
    this.setFaculties(updatedFaculties);
  }

  // STUDENTS
  getStudents(): Student[] {
    const data = localStorage.getItem('students');
    if (!data) return [];
    try {
      return JSON.parse(data) as Student[];
    } catch {
      return [];
    }
  }
  setStudents(students: Student[]) {
    localStorage.setItem('students', JSON.stringify(students));
  }
  addStudent(studentData: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      id: Date.now().toString(),
      ...studentData,
    };
    const updated = [...students, newStudent];
    this.setStudents(updated);
    return newStudent;
  }
  deleteStudent(id: string) {
    const students = this.getStudents();
    const updated = students.filter(s => s.id !== id);
    this.setStudents(updated);
  }

  // COURSES
  getCourses(): Course[] {
    const data = localStorage.getItem('courses');
    if (!data) return [];
    try {
      return JSON.parse(data) as Course[];
    } catch {
      return [];
    }
  }
  setCourses(courses: Course[]) {
    localStorage.setItem('courses', JSON.stringify(courses));
  }
  addCourse(courseData: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseData,
    };
    const updated = [...courses, newCourse];
    this.setCourses(updated);
    return newCourse;
  }
  deleteCourse(id: string) {
    const courses = this.getCourses();
    const updated = courses.filter(c => c.id !== id);
    this.setCourses(updated);
  }

  // VENUES
  getVenues(): Venue[] {
    const data = localStorage.getItem('venues');
    if (!data) return [];
    try {
      return JSON.parse(data) as Venue[];
    } catch {
      return [];
    }
  }
  setVenues(venues: Venue[]) {
    localStorage.setItem('venues', JSON.stringify(venues));
  }
  addVenue(venueData: Omit<Venue, 'id'>): Venue {
    const venues = this.getVenues();
    const newVenue: Venue = {
      id: Date.now().toString(),
      ...venueData,
    };
    const updated = [...venues, newVenue];
    this.setVenues(updated);
    return newVenue;
  }
  deleteVenue(id: string) {
    const venues = this.getVenues();
    const updated = venues.filter(v => v.id !== id);
    this.setVenues(updated);
  }

  // TIMETABLES
  getTimetables(): GeneratedTimetable[] {
    const data = localStorage.getItem('timetables');
    if (!data) return [];
    try {
      return JSON.parse(data) as GeneratedTimetable[];
    } catch {
      return [];
    }
  }
  setTimetables(timetables: GeneratedTimetable[]) {
    localStorage.setItem('timetables', JSON.stringify(timetables));
  }
  addTimetable(timetableData: Omit<GeneratedTimetable, 'id'>): GeneratedTimetable {
    const timetables = this.getTimetables();
    const newTimetable: GeneratedTimetable = {
      id: Date.now().toString(),
      ...timetableData,
    };
    const updated = [...timetables, newTimetable];
    this.setTimetables(updated);
    return newTimetable;
  }
  deleteTimetable(id: string) {
    const timetables = this.getTimetables();
    const updated = timetables.filter(t => t.id !== id);
    this.setTimetables(updated);
  }
}