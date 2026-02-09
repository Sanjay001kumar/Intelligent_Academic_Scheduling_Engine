import { Course, Faculty, Venue, TimetableEntry, TimeSlot } from '@/types';

export class TimetableSolver {
  private courses: Course[];
  private faculties: Faculty[];
  private venues: Venue[];

  constructor(courses: Course[], faculties: Faculty[], venues: Venue[]) {
    this.courses = courses;
    this.faculties = faculties;
    this.venues = venues;
  }

  public generateTimetable(): TimetableEntry[] {
    const entries: TimetableEntry[] = [];
    const timeSlots = this.generateTimeSlots();
    const usedSlots = new Set<string>();

    for (const course of this.courses) {
      const faculty = this.faculties.find(f => f.id === course.faculty);
      if (!faculty) continue;

      const suitableVenues = this.venues.filter(v => 
        v.capacity >= course.enrolledStudents && 
        course.requiredVenues.includes(v.type)
      );

      if (suitableVenues.length === 0) continue;

      // Find available time slot
      for (const slot of timeSlots) {
        const slotKey = `${faculty.id}-${slot.day}-${slot.startTime}`;
        const venueSlotKey = `${suitableVenues[0].id}-${slot.day}-${slot.startTime}`;
        
        if (!usedSlots.has(slotKey) && !usedSlots.has(venueSlotKey)) {
          entries.push({
            id: Date.now().toString() + Math.random(),
            course,
            faculty,
            venue: suitableVenues[0],
            timeSlot: slot,
            students: course.enrolledStudents
          });

          usedSlots.add(slotKey);
          usedSlots.add(venueSlotKey);
          break;
        }
      }
    }

    return entries;
  }

  private generateTimeSlots(): TimeSlot[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];

    const slots: TimeSlot[] = [];
    for (const day of days) {
      for (const time of times) {
        slots.push({
          day,
          startTime: time.start,
          endTime: time.end
        });
      }
    }

    return slots;
  }
}