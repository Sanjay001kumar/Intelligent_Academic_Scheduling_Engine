// /lib/timetableGenerator.ts

// Type definitions for course input
export type CourseInput = {
  name: string;              // Course name
  code: string;              // Course code
  duration: number;          // Duration in hours per session
  faculty: string;           // Faculty name assigned to course
  requiredVenues: string[];  // List of venue names course can use
  enrolledStudents: number;  // Number of enrolled students
};

// Type definitions for faculty input
export type FacultyInput = {
  name: string;             // Faculty name
  availableSlots: string[]; // Available time slots e.g. "Mon-9am-12pm"
  maxHoursPerWeek: number;  // Maximum teaching hours per week
};

// Type definitions for venue input
export type VenueInput = {
  name: string;            // Venue name
  capacity: number;        // Venue capacity
  availability: string[];  // Available time slots e.g. "Mon-9am-12pm"
};

// Type for a scheduled timetable entry
export type ScheduledEntry = {
  course: string;   // Course name
  faculty: string;  // Faculty name
  venue: string;    // Venue name
  slot: string;     // Assigned time slot
};

/**
 * Generates a timetable by assigning courses to faculty slots and venues.
 * Ensures faculty max hours, venue availability, and capacity constraints.
 *
 * @param courses - List of courses to schedule
 * @param faculties - Faculty list with available slots and max hours
 * @param venues - Venue list with availability and capacity
 * @returns List of scheduled timetable entries
 */
export function generateTimetable(
  courses: CourseInput[],
  faculties: FacultyInput[],
  venues: VenueInput[]
): ScheduledEntry[] {
  const timetable: ScheduledEntry[] = [];
  const facultyHours: Record<string, number> = {};
  const venueOccupiedSlots: Record<string, Set<string>> = {};

  // Initialize tracking for hours taught per faculty & slots used per venue
  faculties.forEach(faculty => {
    facultyHours[faculty.name] = 0;
  });
  venues.forEach(venue => {
    venueOccupiedSlots[venue.name] = new Set<string>();
  });

  for (const course of courses) {
    // Find assigned faculty object
    const faculty = faculties.find(fac => fac.name === course.faculty);
    if (!faculty) {
      console.warn(`No faculty found for course "${course.name}" with faculty name "${course.faculty}"`);
      continue;
    }

    let scheduled = false;

    // Try each faculty available slot to allocate the course
    for (const slot of faculty.availableSlots) {
      // Check if assigning this course exceeds faculty max hours
      if (facultyHours[faculty.name] + course.duration > faculty.maxHoursPerWeek) {
        continue;  // Skip slot if would exceed max hours
      }

      // Find a venue that is suitable and available for this slot
      const availableVenue = venues.find(venue =>
        course.requiredVenues.includes(venue.name) &&
        venue.capacity >= course.enrolledStudents &&
        venue.availability.includes(slot) &&
        !venueOccupiedSlots[venue.name].has(slot)
      );

      if (availableVenue) {
        // Schedule the course for this faculty, venue and slot
        timetable.push({
          course: course.name,
          faculty: faculty.name,
          venue: availableVenue.name,
          slot: slot
        });

        // Update tracking values
        facultyHours[faculty.name] += course.duration;
        venueOccupiedSlots[availableVenue.name].add(slot);

        scheduled = true;
        break; // Move to next course once scheduled
      }
    }

    if (!scheduled) {
      console.warn(`Could not schedule course "${course.name}" due to constraints.`);
    }
  }

  return timetable;
}
