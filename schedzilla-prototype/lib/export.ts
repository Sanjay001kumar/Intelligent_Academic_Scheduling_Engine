import { GeneratedTimetable } from '@/types';

export class ExportService {
  public static exportToCSV(timetable: GeneratedTimetable): void {
    const headers = ['Course', 'Faculty', 'Venue', 'Day', 'Time', 'Students'];
    const rows = timetable.entries.map(entry => [
      entry.course.name,
      entry.faculty.name,
      entry.venue.name,
      entry.timeSlot.day,
      `${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}`,
      entry.students.toString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${timetable.name}_timetable.csv`;
    link.click();
  }

  public static exportToPDF(timetable: GeneratedTimetable): void {
    // Create a simple HTML table for PDF export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${timetable.name} - Timetable</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${timetable.name}</h1>
        <p><strong>Academic Year:</strong> ${timetable.academicYear}</p>
        <p><strong>Semester:</strong> ${timetable.semester}</p>
        <p><strong>Generated on:</strong> ${new Date(timetable.createdAt).toLocaleDateString()}</p>
        
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Faculty</th>
              <th>Venue</th>
              <th>Day</th>
              <th>Time</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            ${timetable.entries.map(entry => `
              <tr>
                <td>${entry.course.name}</td>
                <td>${entry.faculty.name}</td>
                <td>${entry.venue.name}</td>
                <td>${entry.timeSlot.day}</td>
                <td>${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}</td>
                <td>${entry.students}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        URL.revokeObjectURL(url);
      };
    }
  }
}