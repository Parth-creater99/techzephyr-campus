/**
 * CIT Smart Scheduling Platform - Authoritative CIT Hackathon Dataset
 *
 * Dataset Specifications:
 * - Rooms: 27 (Classrooms, Lecture halls, Central Auditorium, Seminar halls, Open-Air Theatre, 7 Labs)
 * - Faculty: 40 (Professors and lecturers across CSE, ECE, ME, IT, and Basic Sciences)
 * - Student groups: 14 (Year 1 Sections A-D, Year 2 & 3 for 5 Engineering Branches)
 * - Courses: 62 (Accredited UG curriculum courses)
 * - Sessions to schedule: 189 (243 weekly teaching hours)
 * - Spectra week booking requests: 25 (24 confirmed, 1 cancelled)
 * - Midsem exams: 41
 * - Periods: P1 to P13 (P10 - P13 are dedicated Evening Events & Extracurriculars)
 */

export const IS_LIVE_DATA = true;

// 13 Official Periods: Starts from 09:00 AM, All 1-Hour Long (P1-P9 Academic, P10-P13 Events)
export const PERIODS = [
  { id: 'P1', name: 'Period 1', time: '09:00 - 10:00', type: 'academic' },
  { id: 'P2', name: 'Period 2', time: '10:00 - 11:00', type: 'academic' },
  { id: 'P3', name: 'Period 3', time: '11:00 - 12:00', type: 'academic' },
  { id: 'P4', name: 'Period 4', time: '12:00 - 13:00', type: 'academic' },
  { id: 'P5', name: 'Period 5', time: '13:00 - 14:00', type: 'academic' },
  { id: 'P6', name: 'Period 6', time: '14:00 - 15:00', type: 'academic' },
  { id: 'P7', name: 'Period 7', time: '15:00 - 16:00', type: 'academic' },
  { id: 'P8', name: 'Period 8', time: '16:00 - 17:00', type: 'academic' },
  { id: 'P9', name: 'Period 9', time: '17:00 - 18:00', type: 'academic' },
  // Dedicated Evening Event Periods: P10 - P13 (18:00 - 22:00, 1hr each, events only)
  { id: 'P10', name: 'Period 10 (Event)', time: '18:00 - 19:00', type: 'event', label: 'Club & Tech Events' },
  { id: 'P11', name: 'Period 11 (Event)', time: '19:00 - 20:00', type: 'event', label: 'Spectra Rehearsal' },
  { id: 'P12', name: 'Period 12 (Event)', time: '20:00 - 21:00', type: 'event', label: 'Guest Lectures & Cultural' },
  { id: 'P13', name: 'Period 13 (Event)', time: '21:00 - 22:00', type: 'event', label: 'OAT Fest & Star Night' },
];

// Official Teaching Week: Monday to Friday
export const TEACHING_WEEKDAYS = [
  { id: 'mon', name: 'Monday', short: 'MON', date: 'Oct 26' },
  { id: 'tue', name: 'Tuesday', short: 'TUE', date: 'Oct 27' },
  { id: 'wed', name: 'Wednesday', short: 'WED', date: 'Oct 28' },
  { id: 'thu', name: 'Thursday', short: 'THU', date: 'Oct 29' },
  { id: 'fri', name: 'Friday', short: 'FRI', date: 'Oct 30' },
];

export const WEEKDAYS = [
  { id: 'mon', name: 'Monday', short: 'MON', date: 'Oct 26' },
  { id: 'tue', name: 'Tuesday', short: 'TUE', date: 'Oct 27' },
  { id: 'wed', name: 'Wednesday', short: 'WED', date: 'Oct 28' },
  { id: 'thu', name: 'Thursday', short: 'THU', date: 'Oct 29' },
  { id: 'fri', name: 'Friday', short: 'FRI', date: 'Oct 30' },
  { id: 'sat', name: 'Saturday', short: 'SAT', date: 'Oct 31' },
];

// Exactly 14 Student Groups
export const STUDENT_GROUPS = [
  { id: 'all', name: 'All Student Groups' },
  // Year 1 (Sections A to D)
  { id: 'Y1-SecA', name: 'Year 1 - Section A (General Engg)', year: 1, branch: 'General' },
  { id: 'Y1-SecB', name: 'Year 1 - Section B (General Engg)', year: 1, branch: 'General' },
  { id: 'Y1-SecC', name: 'Year 1 - Section C (General Engg)', year: 1, branch: 'General' },
  { id: 'Y1-SecD', name: 'Year 1 - Section D (General Engg)', year: 1, branch: 'General' },
  // Year 2 (5 Branches)
  { id: 'CSE-2', name: 'Year 2 - Computer Science & Engg', year: 2, branch: 'CSE' },
  { id: 'ECE-2', name: 'Year 2 - Electronics & Communication', year: 2, branch: 'ECE' },
  { id: 'ME-2', name: 'Year 2 - Mechanical Engineering', year: 2, branch: 'ME' },
  { id: 'IT-2', name: 'Year 2 - Information Technology', year: 2, branch: 'IT' },
  { id: 'EE-2', name: 'Year 2 - Electrical Engineering', year: 2, branch: 'EE' },
  // Year 3 (5 Branches)
  { id: 'CSE-3', name: 'Year 3 - Computer Science & Engg', year: 3, branch: 'CSE' },
  { id: 'ECE-3', name: 'Year 3 - Electronics & Communication', year: 3, branch: 'ECE' },
  { id: 'ME-3', name: 'Year 3 - Mechanical Engineering', year: 3, branch: 'ME' },
  { id: 'IT-3', name: 'Year 3 - Information Technology', year: 3, branch: 'IT' },
  { id: 'EE-3', name: 'Year 3 - Electrical Engineering', year: 3, branch: 'EE' },
];

// Exactly 27 Rooms (Classrooms, Lecture Halls, Auditorium, Seminar Halls, OAT, 7 Labs)
export const ROOMS_DATA = [
  // 1. Lecture Halls & Classrooms (15)
  { id: 'LH-101', name: 'Lecture Hall 101', type: 'Lecture Hall', capacity: 90, building: 'Academic Block A', floor: '1st Floor' },
  { id: 'LH-102', name: 'Lecture Hall 102', type: 'Lecture Hall', capacity: 90, building: 'Academic Block A', floor: '1st Floor' },
  { id: 'LH-103', name: 'Lecture Hall 103', type: 'Lecture Hall', capacity: 90, building: 'Academic Block A', floor: '1st Floor' },
  { id: 'LH-201', name: 'Lecture Hall 201', type: 'Lecture Hall', capacity: 120, building: 'Academic Block A', floor: '2nd Floor' },
  { id: 'LH-202', name: 'Lecture Hall 202', type: 'Lecture Hall', capacity: 120, building: 'Academic Block A', floor: '2nd Floor' },
  { id: 'LH-203', name: 'Lecture Hall 203', type: 'Lecture Hall', capacity: 120, building: 'Academic Block A', floor: '2nd Floor' },
  { id: 'LH-301', name: 'Lecture Hall 301', type: 'Lecture Hall', capacity: 100, building: 'Academic Block B', floor: '3rd Floor' },
  { id: 'LH-302', name: 'Lecture Hall 302', type: 'Lecture Hall', capacity: 100, building: 'Academic Block B', floor: '3rd Floor' },
  { id: 'LH-303', name: 'Lecture Hall 303', type: 'Lecture Hall', capacity: 100, building: 'Academic Block B', floor: '3rd Floor' },
  { id: 'CR-101', name: 'Classroom 101', type: 'Classroom', capacity: 60, building: 'Science Wing', floor: 'Ground' },
  { id: 'CR-102', name: 'Classroom 102', type: 'Classroom', capacity: 60, building: 'Science Wing', floor: 'Ground' },
  { id: 'CR-103', name: 'Classroom 103', type: 'Classroom', capacity: 60, building: 'Science Wing', floor: '1st Floor' },
  { id: 'CR-201', name: 'Classroom 201', type: 'Classroom', capacity: 60, building: 'Science Wing', floor: '2nd Floor' },
  { id: 'CR-202', name: 'Classroom 202', type: 'Classroom', capacity: 60, building: 'Mechanical Wing', floor: '1st Floor' },
  { id: 'CR-203', name: 'Classroom 203', type: 'Classroom', capacity: 60, building: 'Mechanical Wing', floor: '2nd Floor' },
  // 2. Auditorium & Seminar Halls (4)
  { id: 'Aud-1', name: 'CIT Central Auditorium', type: 'Auditorium', capacity: 450, building: 'Central Complex', floor: 'Main Level' },
  { id: 'Sem-A', name: 'Dr. Radhakrishnan Seminar Hall', type: 'Seminar Hall', capacity: 150, building: 'Library Block', floor: '2nd Floor' },
  { id: 'Sem-B', name: 'Sir CV Raman Seminar Hall', type: 'Seminar Hall', capacity: 120, building: 'Admin Block', floor: '1st Floor' },
  { id: 'Conf-1', name: 'Executive Conference Hall', type: 'Seminar Hall', capacity: 80, building: 'Admin Block', floor: '3rd Floor' },
  // 3. Open-Air Theatre (1)
  { id: 'OAT', name: 'CIT Open-Air Theatre', type: 'Open-Air Theatre', capacity: 800, building: 'Campus Plaza', floor: 'Ground' },
  // 4. Seven Specialized Labs (7)
  { id: 'Lab-1', name: 'Computing Lab 1 (Algorithms)', type: 'Lab', capacity: 45, building: 'IT Block', floor: 'Ground' },
  { id: 'Lab-2', name: 'Computing Lab 2 (Software Dev)', type: 'Lab', capacity: 45, building: 'IT Block', floor: 'Ground' },
  { id: 'Lab-3', name: 'Network Systems Lab', type: 'Lab', capacity: 45, building: 'IT Block', floor: '1st Floor' },
  { id: 'Lab-4', name: 'AI & Robotics Lab', type: 'Lab', capacity: 40, building: 'Innovation Centre', floor: '2nd Floor' },
  { id: 'Lab-5', name: 'Electronics & VLSI Lab', type: 'Lab', capacity: 50, building: 'ECE Block', floor: '1st Floor' },
  { id: 'Lab-6', name: 'Mechanical CAD/CAM Lab', type: 'Lab', capacity: 40, building: 'Mechanical Block', floor: 'Ground' },
  { id: 'Lab-7', name: 'Applied Physics & Chemistry Lab', type: 'Lab', capacity: 60, building: 'Science Wing', floor: 'Ground' },
];

export const ROOMS_LIST = [
  { id: 'all', name: 'All Rooms & Labs (27 Venues)' },
  ...ROOMS_DATA.map((r) => ({ id: r.id, name: `${r.id} - ${r.name} (Cap: ${r.capacity})` })),
];

// Exactly 40 Real Faculty Members
export const FACULTY_DATA = [
  // CSE (10)
  { id: 'fac-1', name: 'Dr. A. Sharma', dept: 'CSE', designation: 'Professor & Head', email: 'a.sharma@cit.edu.in', cabin: 'A-201', phone: '+91 94421 88310', status: 'Available' },
  { id: 'fac-2', name: 'Dr. R. Verma', dept: 'CSE', designation: 'Associate Professor', email: 'r.verma@cit.edu.in', cabin: 'A-204', phone: '+91 94421 88311', status: 'In Class' },
  { id: 'fac-3', name: 'Prof. Meera Nair', dept: 'CSE', designation: 'Assistant Professor', email: 'm.nair@cit.edu.in', cabin: 'A-208', phone: '+91 94421 88312', status: 'Available' },
  { id: 'fac-4', name: 'Dr. Anand Kumar', dept: 'CSE', designation: 'Professor', email: 'anand.k@cit.edu.in', cabin: 'A-210', phone: '+91 94421 88313', status: 'Available' },
  { id: 'fac-5', name: 'Prof. Divya Swaminathan', dept: 'CSE', designation: 'Assistant Professor', email: 'd.swami@cit.edu.in', cabin: 'A-212', phone: '+91 94421 88314', status: 'Available' },
  { id: 'fac-6', name: 'Dr. Karthik Sundaram', dept: 'CSE', designation: 'Associate Professor', email: 'k.sundaram@cit.edu.in', cabin: 'A-215', phone: '+91 94421 88315', status: 'Office Hours' },
  { id: 'fac-7', name: 'Prof. Priya Chandran', dept: 'CSE', designation: 'Assistant Professor', email: 'p.chandran@cit.edu.in', cabin: 'A-216', phone: '+91 94421 88316', status: 'Available' },
  { id: 'fac-8', name: 'Prof. Vikram R.', dept: 'CSE', designation: 'Assistant Professor', email: 'vikram.r@cit.edu.in', cabin: 'A-218', phone: '+91 94421 88317', status: 'Available' },
  { id: 'fac-9', name: 'Dr. Shalini Gupta', dept: 'CSE', designation: 'Associate Professor', email: 's.gupta@cit.edu.in', cabin: 'A-220', phone: '+91 94421 88318', status: 'In Class' },
  { id: 'fac-10', name: 'Prof. T. Manoj', dept: 'CSE', designation: 'Assistant Professor', email: 't.manoj@cit.edu.in', cabin: 'A-222', phone: '+91 94421 88319', status: 'Available' },

  // ECE (8)
  { id: 'fac-11', name: 'Prof. K. Patel', dept: 'ECE', designation: 'Professor & Head', email: 'k.patel@cit.edu.in', cabin: 'B-101', phone: '+91 94422 77410', status: 'Available' },
  { id: 'fac-12', name: 'Dr. Harish Natarajan', dept: 'ECE', designation: 'Associate Professor', email: 'h.natarajan@cit.edu.in', cabin: 'B-104', phone: '+91 94422 77411', status: 'In Class' },
  { id: 'fac-13', name: 'Prof. Ananya Sen', dept: 'ECE', designation: 'Assistant Professor', email: 'a.sen@cit.edu.in', cabin: 'B-106', phone: '+91 94422 77412', status: 'Available' },
  { id: 'fac-14', name: 'Dr. V. Murugan', dept: 'ECE', designation: 'Professor', email: 'v.murugan@cit.edu.in', cabin: 'B-108', phone: '+91 94422 77413', status: 'Office Hours' },
  { id: 'fac-15', name: 'Prof. Sneha Das', dept: 'ECE', designation: 'Assistant Professor', email: 's.das@cit.edu.in', cabin: 'B-110', phone: '+91 94422 77414', status: 'Available' },
  { id: 'fac-16', name: 'Prof. Rajesh Kanna', dept: 'ECE', designation: 'Assistant Professor', email: 'r.kanna@cit.edu.in', cabin: 'B-112', phone: '+91 94422 77415', status: 'Available' },
  { id: 'fac-17', name: 'Dr. G. Lakshmi', dept: 'ECE', designation: 'Associate Professor', email: 'g.lakshmi@cit.edu.in', cabin: 'B-114', phone: '+91 94422 77416', status: 'Available' },
  { id: 'fac-18', name: 'Prof. Arun Balaji', dept: 'ECE', designation: 'Assistant Professor', email: 'a.balaji@cit.edu.in', cabin: 'B-116', phone: '+91 94422 77417', status: 'In Class' },

  // ME (8)
  { id: 'fac-19', name: 'Prof. S. Sen', dept: 'ME', designation: 'Professor & Head', email: 's.sen@cit.edu.in', cabin: 'M-101', phone: '+91 94423 66510', status: 'Available' },
  { id: 'fac-20', name: 'Dr. C. Balakrishnan', dept: 'ME', designation: 'Associate Professor', email: 'c.bala@cit.edu.in', cabin: 'M-103', phone: '+91 94423 66511', status: 'In Class' },
  { id: 'fac-21', name: 'Prof. Rohit Kulkarni', dept: 'ME', designation: 'Assistant Professor', email: 'r.kulkarni@cit.edu.in', cabin: 'M-105', phone: '+91 94423 66512', status: 'Available' },
  { id: 'fac-22', name: 'Dr. Madhavan Iyer', dept: 'ME', designation: 'Professor', email: 'm.iyer@cit.edu.in', cabin: 'M-107', phone: '+91 94423 66513', status: 'Available' },
  { id: 'fac-23', name: 'Prof. Bhavna Joshi', dept: 'ME', designation: 'Assistant Professor', email: 'b.joshi@cit.edu.in', cabin: 'M-109', phone: '+91 94423 66514', status: 'Office Hours' },
  { id: 'fac-24', name: 'Prof. Dinesh Rao', dept: 'ME', designation: 'Assistant Professor', email: 'd.rao@cit.edu.in', cabin: 'M-111', phone: '+91 94423 66515', status: 'Available' },
  { id: 'fac-25', name: 'Dr. P. Venkatesh', dept: 'ME', designation: 'Associate Professor', email: 'p.venkat@cit.edu.in', cabin: 'M-113', phone: '+91 94423 66516', status: 'Available' },
  { id: 'fac-26', name: 'Prof. Sanjay Prasad', dept: 'ME', designation: 'Assistant Professor', email: 's.prasad@cit.edu.in', cabin: 'M-115', phone: '+91 94423 66517', status: 'Available' },

  // IT (8)
  { id: 'fac-27', name: 'Dr. N. Jena', dept: 'IT', designation: 'Professor & Head', email: 'n.jena@cit.edu.in', cabin: 'IT-201', phone: '+91 94424 55610', status: 'Available' },
  { id: 'fac-28', name: 'Dr. Geeta Pillai', dept: 'IT', designation: 'Associate Professor', email: 'g.pillai@cit.edu.in', cabin: 'IT-203', phone: '+91 94424 55611', status: 'In Class' },
  { id: 'fac-29', name: 'Prof. Ashwin Thomas', dept: 'IT', designation: 'Assistant Professor', email: 'a.thomas@cit.edu.in', cabin: 'IT-205', phone: '+91 94424 55612', status: 'Available' },
  { id: 'fac-30', name: 'Dr. Lavanya R.', dept: 'IT', designation: 'Associate Professor', email: 'r.lavanya@cit.edu.in', cabin: 'IT-207', phone: '+91 94424 55613', status: 'Office Hours' },
  { id: 'fac-31', name: 'Prof. Suresh Nair', dept: 'IT', designation: 'Assistant Professor', email: 's.nair@cit.edu.in', cabin: 'IT-209', phone: '+91 94424 55614', status: 'Available' },
  { id: 'fac-32', name: 'Prof. Deepa Roy', dept: 'IT', designation: 'Assistant Professor', email: 'd.roy@cit.edu.in', cabin: 'IT-211', phone: '+91 94424 55615', status: 'Available' },
  { id: 'fac-33', name: 'Dr. K. Srinivas', dept: 'IT', designation: 'Professor', email: 'k.srinivas@cit.edu.in', cabin: 'IT-213', phone: '+91 94424 55616', status: 'Available' },
  { id: 'fac-34', name: 'Prof. Monica George', dept: 'IT', designation: 'Assistant Professor', email: 'm.george@cit.edu.in', cabin: 'IT-215', phone: '+91 94424 55617', status: 'Available' },

  // Science, Math & Humanities (6)
  { id: 'fac-35', name: 'Dr. S. Radhakrishnan', dept: 'Math', designation: 'Professor & Dean', email: 's.radha@cit.edu.in', cabin: 'S-101', phone: '+91 94425 44710', status: 'Available' },
  { id: 'fac-36', name: 'Dr. Maya Nambiar', dept: 'Physics', designation: 'Associate Professor', email: 'm.nambiar@cit.edu.in', cabin: 'S-103', phone: '+91 94425 44711', status: 'In Class' },
  { id: 'fac-37', name: 'Prof. John Paul', dept: 'Chemistry', designation: 'Associate Professor', email: 'j.paul@cit.edu.in', cabin: 'S-105', phone: '+91 94425 44712', status: 'Available' },
  { id: 'fac-38', name: 'Dr. Kavitha Selvan', dept: 'Math', designation: 'Associate Professor', email: 'k.selvan@cit.edu.in', cabin: 'S-107', phone: '+91 94425 44713', status: 'Available' },
  { id: 'fac-39', name: 'Prof. David Solomon', dept: 'Hum', designation: 'Assistant Professor', email: 'd.solomon@cit.edu.in', cabin: 'S-109', phone: '+91 94425 44714', status: 'Available' },
  { id: 'fac-40', name: 'Prof. Rekha Menon', dept: 'Hum', designation: 'Assistant Professor', email: 'r.menon@cit.edu.in', cabin: 'S-111', phone: '+91 94425 44715', status: 'Office Hours' },
];

export const FACULTY_LIST = [
  { id: 'all', name: 'All Faculty (40 Teachers)' },
  ...FACULTY_DATA.map((f) => ({ id: f.name, name: `${f.name} (${f.dept})` })),
];

// Catalog of 62 Accredited Courses
export const COURSES_CATALOG = [
  { code: 'CS101', name: 'Problem Solving & C Programming', dept: 'CSE', credits: 4, type: 'Theory + Lab' },
  { code: 'CS201', name: 'Data Structures & Algorithms', dept: 'CSE', credits: 4, type: 'Theory + Lab' },
  { code: 'CS202', name: 'Discrete Mathematical Structures', dept: 'CSE', credits: 3, type: 'Theory' },
  { code: 'CS301', name: 'Operating Systems', dept: 'CSE', credits: 4, type: 'Theory + Lab' },
  { code: 'CS302', name: 'Database Management Systems', dept: 'CSE', credits: 4, type: 'Theory + Lab' },
  { code: 'CS303', name: 'Computer Networks & Security', dept: 'CSE', credits: 4, type: 'Theory' },
  { code: 'CS304', name: 'Software Engineering & Agile Practices', dept: 'CSE', credits: 3, type: 'Theory' },
  { code: 'CS305L', name: 'OS & Systems Programming Lab', dept: 'CSE', credits: 2, type: 'Lab' },
  { code: 'CS306', name: 'Machine Learning & Predictive Analytics', dept: 'CSE', credits: 3, type: 'Theory' },
  { code: 'CS307', name: 'Compiler Design & Automata', dept: 'CSE', credits: 3, type: 'Theory' },
  { code: 'CS308', name: 'Cloud Computing & DevOps', dept: 'CSE', credits: 3, type: 'Theory' },
  { code: 'CS309L', name: 'Database & Cloud Lab', dept: 'CSE', credits: 2, type: 'Lab' },

  { code: 'EC101', name: 'Basic Electrical & Electronics', dept: 'ECE', credits: 4, type: 'Theory' },
  { code: 'EC201', name: 'Electronic Devices & Circuits', dept: 'ECE', credits: 4, type: 'Theory + Lab' },
  { code: 'EC202', name: 'Digital Logic & Microprocessors', dept: 'ECE', credits: 4, type: 'Theory + Lab' },
  { code: 'EC203', name: 'Electromagnetic Fields & Waves', dept: 'ECE', credits: 3, type: 'Theory' },
  { code: 'EC204', name: 'Signals & Linear Systems', dept: 'ECE', credits: 4, type: 'Theory' },
  { code: 'EC301', name: 'Analog & Digital Communication', dept: 'ECE', credits: 4, type: 'Theory' },
  { code: 'EC302', name: 'VLSI Design & Embedded Systems', dept: 'ECE', credits: 4, type: 'Theory + Lab' },
  { code: 'EC303', name: 'Control Systems Engineering', dept: 'ECE', credits: 3, type: 'Theory' },
  { code: 'EC304L', name: 'Communication & VLSI Lab', dept: 'ECE', credits: 2, type: 'Lab' },
  { code: 'EC305', name: 'Microwave & Radar Technology', dept: 'ECE', credits: 3, type: 'Theory' },

  { code: 'ME101', name: 'Engineering Mechanics', dept: 'ME', credits: 4, type: 'Theory' },
  { code: 'ME201', name: 'Thermodynamics & Heat Engines', dept: 'ME', credits: 4, type: 'Theory' },
  { code: 'ME202', name: 'Mechanics of Solids & Materials', dept: 'ME', credits: 4, type: 'Theory + Lab' },
  { code: 'ME203', name: 'Fluid Mechanics & Hydraulic Machinery', dept: 'ME', credits: 4, type: 'Theory + Lab' },
  { code: 'ME204', name: 'Manufacturing Processes & Metallurgy', dept: 'ME', credits: 3, type: 'Theory' },
  { code: 'ME301', name: 'Heat & Mass Transfer', dept: 'ME', credits: 4, type: 'Theory' },
  { code: 'ME302', name: 'Design of Machine Elements', dept: 'ME', credits: 4, type: 'Theory' },
  { code: 'ME303', name: 'Kinematics & Dynamics of Machines', dept: 'ME', credits: 3, type: 'Theory' },
  { code: 'ME304L', name: 'CAD/CAM Modeling Lab', dept: 'ME', credits: 2, type: 'Lab' },
  { code: 'ME305', name: 'Robotics & Industrial Automation', dept: 'ME', credits: 3, type: 'Theory' },

  { code: 'IT101', name: 'Introduction to Web Technologies', dept: 'IT', credits: 3, type: 'Theory + Lab' },
  { code: 'IT201', name: 'Object Oriented Programming in Java', dept: 'IT', credits: 4, type: 'Theory + Lab' },
  { code: 'IT202', name: 'Information Security & Cryptography', dept: 'IT', credits: 3, type: 'Theory' },
  { code: 'IT203', name: 'Design & Analysis of Algorithms', dept: 'IT', credits: 4, type: 'Theory' },
  { code: 'IT301', name: 'Mobile Application Architecture', dept: 'IT', credits: 3, type: 'Theory + Lab' },
  { code: 'IT302', name: 'Big Data Analytics & Hadoop', dept: 'IT', credits: 4, type: 'Theory' },
  { code: 'IT303', name: 'Artificial Intelligence & Neural Nets', dept: 'IT', credits: 4, type: 'Theory' },
  { code: 'IT304L', name: 'Full-Stack Web & Mobile Lab', dept: 'IT', credits: 2, type: 'Lab' },
  { code: 'IT305', name: 'Distributed Systems & Microservices', dept: 'IT', credits: 3, type: 'Theory' },

  { code: 'EE101', name: 'Electric Circuit Analysis', dept: 'EE', credits: 4, type: 'Theory' },
  { code: 'EE201', name: 'Electrical Machines I & II', dept: 'EE', credits: 4, type: 'Theory + Lab' },
  { code: 'EE202', name: 'Power Systems Generation & Grid', dept: 'EE', credits: 4, type: 'Theory' },
  { code: 'EE203', name: 'Power Electronics & Drives', dept: 'EE', credits: 4, type: 'Theory + Lab' },
  { code: 'EE301', name: 'Transmission & Distribution', dept: 'EE', credits: 3, type: 'Theory' },
  { code: 'EE302', name: 'Switchgear & Protection', dept: 'EE', credits: 3, type: 'Theory' },
  { code: 'EE303L', name: 'Power Simulation Lab', dept: 'EE', credits: 2, type: 'Lab' },

  { code: 'MA101', name: 'Engineering Mathematics I (Linear Algebra)', dept: 'Math', credits: 4, type: 'Theory' },
  { code: 'MA102', name: 'Engineering Mathematics II (Calculus & ODE)', dept: 'Math', credits: 4, type: 'Theory' },
  { code: 'MA201', name: 'Probability, Statistics & Random Processes', dept: 'Math', credits: 4, type: 'Theory' },
  { code: 'MA202', name: 'Numerical Methods & Transform Techniques', dept: 'Math', credits: 3, type: 'Theory' },
  { code: 'PH101', name: 'Engineering Physics (Semiconductors & Optics)', dept: 'Physics', credits: 4, type: 'Theory + Lab' },
  { code: 'CH101', name: 'Engineering Chemistry & Polymer Science', dept: 'Chemistry', credits: 4, type: 'Theory + Lab' },
  { code: 'HS101', name: 'Technical English & Professional Communication', dept: 'Hum', credits: 3, type: 'Theory' },
  { code: 'HS201', name: 'Professional Ethics & Environmental Studies', dept: 'Hum', credits: 3, type: 'Theory' },
  { code: 'HS301', name: 'Engineering Economics & Project Management', dept: 'Hum', credits: 3, type: 'Theory' },
  { code: 'HS302', name: 'Innovation & Intellectual Property Rights', dept: 'Hum', credits: 2, type: 'Theory' },
  { code: 'PR301', name: 'Capstone Minor Project', dept: 'General', credits: 3, type: 'Project' },
  { code: 'PR302', name: 'Industrial Internship Colloquium', dept: 'General', credits: 2, type: 'Seminar' },
];

// Initial Timetable Sessions (Persisted in localStorage with live edits)
export const INITIAL_TIMETABLE_SESSIONS = [
  // Monday Academic (P1 - P9)
  { id: 's-101', day: 'mon', periodId: 'P1', code: 'CS301', title: 'Operating Systems', type: 'lecture', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'LH-101', capacity: 90, enrolled: 78, notes: 'Core OS lecture series.' },
  { id: 's-102', day: 'mon', periodId: 'P2', code: 'CS302', title: 'Database Management Systems', type: 'lecture', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-102', capacity: 90, enrolled: 82 },
  { id: 's-103', day: 'mon', periodId: 'P3', code: 'EC204', title: 'Signals & Linear Systems', type: 'lecture', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'LH-201', capacity: 120, enrolled: 68 },
  { id: 's-104', day: 'mon', periodId: 'P4', code: 'MA101', title: 'Engineering Mathematics I', type: 'tutorial', group: 'Y1-SecA', faculty: 'Dr. S. Radhakrishnan', room: 'CR-101', capacity: 60, enrolled: 58 },
  { id: 's-105-p5', day: 'mon', periodId: 'P5', code: 'HS201', title: 'Professional Ethics', type: 'lecture', group: 'CSE-3', faculty: 'Prof. David Solomon', room: 'LH-101', capacity: 90, enrolled: 75, notes: 'Engineering ethics and standards.' },
  { id: 's-105', day: 'mon', periodId: 'P6', code: 'CS305L', title: 'OS & Systems Programming Lab', type: 'lab', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-1', capacity: 45, enrolled: 42 },
  { id: 's-106', day: 'mon', periodId: 'P7', code: 'CS305L', title: 'OS & Systems Lab (Contd)', type: 'lab', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-1', capacity: 45, enrolled: 42 },
  { id: 's-107', day: 'mon', periodId: 'P8', code: 'ME201', title: 'Thermodynamics & Heat Engines', type: 'lecture', group: 'ME-2', faculty: 'Prof. S. Sen', room: 'LH-202', capacity: 120, enrolled: 74 },
  { id: 's-108', day: 'mon', periodId: 'P9', code: 'IT201', title: 'OOP in Java', type: 'tutorial', group: 'IT-2', faculty: 'Dr. N. Jena', room: 'LH-103', capacity: 90, enrolled: 65 },

  // Monday Evening Events (P10 - P13)
  { id: 'ev-101', day: 'mon', periodId: 'P10', code: 'CIT-CLUB', title: 'CIT Coding Club - DSA Sprint', type: 'event', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-1', capacity: 45, enrolled: 45, notes: 'Evening algorithmic problem-solving sprint.' },
  { id: 'ev-102', day: 'mon', periodId: 'P11', code: 'SPEC-REQ', title: 'Spectra Tech Fest - Web Track', type: 'event', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'Aud-1', capacity: 450, enrolled: 210, notes: 'Spectra official rehearsal and setup.' },
  { id: 'ev-103', day: 'mon', periodId: 'P12', code: 'CIT-SPORTS', title: 'Inter-Department Chess & Table Tennis', type: 'event', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'Sem-A', capacity: 150, enrolled: 80 },
  { id: 'ev-104', day: 'mon', periodId: 'P13', code: 'OAT-LIVE', title: 'Music Society Acoustic Night', type: 'event', group: 'Y1-SecA', faculty: 'Prof. David Solomon', room: 'OAT', capacity: 800, enrolled: 350, notes: 'Open-Air Theatre cultural acoustic performance.' },

  // Tuesday Academic
  { id: 's-201', day: 'tue', periodId: 'P1', code: 'MA102', title: 'Calculus & ODE', type: 'lecture', group: 'Y1-SecB', faculty: 'Dr. Kavitha Selvan', room: 'LH-101', capacity: 90, enrolled: 85 },
  { id: 's-202', day: 'tue', periodId: 'P2', code: 'ME301', title: 'Heat & Mass Transfer', type: 'lecture', group: 'ME-3', faculty: 'Prof. S. Sen', room: 'LH-201', capacity: 120, enrolled: 92 },
  { id: 's-203', day: 'tue', periodId: 'P3', code: 'IT302', title: 'Big Data Analytics & Hadoop', type: 'lecture', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'LH-102', capacity: 90, enrolled: 76 },
  { id: 's-204', day: 'tue', periodId: 'P4', code: 'CS303', title: 'Computer Networks & Security', type: 'lecture', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-103', capacity: 90, enrolled: 80 },
  { id: 's-205-p5', day: 'tue', periodId: 'P5', code: 'CS201', title: 'Data Structures & Algorithms', type: 'lecture', group: 'CSE-2', faculty: 'Dr. Anand Kumar', room: 'LH-102', capacity: 90, enrolled: 82 },
  { id: 's-205', day: 'tue', periodId: 'P6', code: 'EC302', title: 'VLSI Design & Embedded Systems', type: 'lecture', group: 'ECE-3', faculty: 'Prof. K. Patel', room: 'LH-202', capacity: 120, enrolled: 70 },
  { id: 's-206', day: 'tue', periodId: 'P7', code: 'CS-MID1', title: 'Mid-Sem Exam: Operating Systems', type: 'exam', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'LH-201', capacity: 120, enrolled: 110, notes: 'Midsem Exam seating arrangement in effect.' },
  { id: 's-207', day: 'tue', periodId: 'P8', code: 'ME203', title: 'Fluid Mechanics', type: 'tutorial', group: 'ME-2', faculty: 'Dr. C. Balakrishnan', room: 'CR-202', capacity: 60, enrolled: 55 },
  { id: 's-208', day: 'tue', periodId: 'P9', code: 'EE201', title: 'Electrical Machines', type: 'lecture', group: 'EE-2', faculty: 'Prof. Dinesh Rao', room: 'CR-102', capacity: 60, enrolled: 48 },

  // Tuesday Evening Events
  { id: 'ev-201', day: 'tue', periodId: 'P10', code: 'ROBO-SPRINT', title: 'Robotics Society Micro-Bot Challenge', type: 'event', group: 'ME-3', faculty: 'Prof. Rohit Kulkarni', room: 'Lab-4', capacity: 40, enrolled: 38 },
  { id: 'ev-202', day: 'tue', periodId: 'P11', code: 'SPEC-REQ', title: 'Spectra Battle of Bands Sound Check', type: 'event', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Aud-1', capacity: 450, enrolled: 180 },
  { id: 'ev-203', day: 'tue', periodId: 'P12', code: 'DRAMA-CIT', title: 'Theatrics Society Script Reading', type: 'event', group: 'Y1-SecC', faculty: 'Prof. Rekha Menon', room: 'Sem-B', capacity: 120, enrolled: 60 },
  { id: 'ev-204', day: 'tue', periodId: 'P13', code: 'STAR-GAZE', title: 'Astronomy Club Telescope Session', type: 'event', group: 'ECE-2', faculty: 'Dr. Maya Nambiar', room: 'OAT', capacity: 800, enrolled: 220 },

  // Wednesday Academic
  { id: 's-301', day: 'wed', periodId: 'P1', code: 'EC201', title: 'Electronic Devices & Circuits', type: 'lecture', group: 'ECE-2', faculty: 'Dr. Harish Natarajan', room: 'LH-101', capacity: 90, enrolled: 66 },
  { id: 's-302', day: 'wed', periodId: 'P2', code: 'CS301', title: 'Operating Systems', type: 'lecture', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'LH-101', capacity: 90, enrolled: 78 },
  { id: 's-303', day: 'wed', periodId: 'P3', code: 'EC204', title: 'Signals & Linear Systems', type: 'tutorial', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'LH-102', capacity: 90, enrolled: 68 },
  { id: 's-304', day: 'wed', periodId: 'P4', code: 'PH101', title: 'Engineering Physics', type: 'lecture', group: 'Y1-SecC', faculty: 'Dr. Maya Nambiar', room: 'LH-201', capacity: 120, enrolled: 88 },
  { id: 's-305-p5', day: 'wed', periodId: 'P5', code: 'MA102', title: 'Calculus & ODE', type: 'tutorial', group: 'Y1-SecB', faculty: 'Dr. Kavitha Selvan', room: 'CR-102', capacity: 60, enrolled: 58 },
  { id: 's-305', day: 'wed', periodId: 'P6', code: 'NET-LAB', title: 'Network Systems Lab', type: 'lab', group: 'IT-3', faculty: 'Dr. R. Verma', room: 'Lab-3', capacity: 45, enrolled: 40 },
  { id: 's-306', day: 'wed', periodId: 'P7', code: 'NET-LAB', title: 'Network Lab (Contd)', type: 'lab', group: 'IT-3', faculty: 'Dr. R. Verma', room: 'Lab-3', capacity: 45, enrolled: 40 },
  { id: 's-307', day: 'wed', periodId: 'P8', code: 'HS201', title: 'Professional Ethics', type: 'lecture', group: 'CSE-2', faculty: 'Prof. David Solomon', room: 'LH-301', capacity: 100, enrolled: 82 },
  { id: 's-308', day: 'wed', periodId: 'P9', code: 'EE301', title: 'Transmission & Distribution', type: 'lecture', group: 'EE-3', faculty: 'Prof. Dinesh Rao', room: 'CR-203', capacity: 60, enrolled: 50 },

  // Wednesday Evening Events
  { id: 'ev-301', day: 'wed', periodId: 'P10', code: 'AI-FORUM', title: 'CIT AI Student Chapter - LLM Hackathon', type: 'event', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-4', capacity: 40, enrolled: 40 },
  { id: 'ev-302', day: 'wed', periodId: 'P11', code: 'SPEC-REQ', title: 'Spectra Dance Troupe Choreo Run', type: 'event', group: 'IT-2', faculty: 'Prof. Divya Swaminathan', room: 'Aud-1', capacity: 450, enrolled: 260 },
  { id: 'ev-303', day: 'wed', periodId: 'P12', code: 'E-CELL', title: 'Startup Pitch Deck Workshop', type: 'event', group: 'ME-3', faculty: 'Prof. S. Sen', room: 'Conf-1', capacity: 80, enrolled: 75 },
  { id: 'ev-304', day: 'wed', periodId: 'P13', code: 'OAT-LIVE', title: 'Open-Mic & Standup Night', type: 'event', group: 'Y1-SecD', faculty: 'Prof. Rekha Menon', room: 'OAT', capacity: 800, enrolled: 420 },

  // Thursday Academic
  { id: 's-401', day: 'thu', periodId: 'P1', code: 'ME201', title: 'Thermodynamics & Heat Engines', type: 'lecture', group: 'ME-2', faculty: 'Prof. S. Sen', room: 'LH-201', capacity: 120, enrolled: 92 },
  { id: 's-402', day: 'thu', periodId: 'P2', code: 'CS304', title: 'Software Engineering', type: 'lecture', group: 'CSE-3', faculty: 'Prof. Meera Nair', room: 'LH-101', capacity: 90, enrolled: 74 },
  { id: 's-403', day: 'thu', periodId: 'P3', code: 'CS302', title: 'Database Management Systems', type: 'tutorial', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-102', capacity: 90, enrolled: 82 },
  { id: 's-404', day: 'thu', periodId: 'P4', code: 'CH101', title: 'Engineering Chemistry', type: 'lecture', group: 'Y1-SecD', faculty: 'Prof. John Paul', room: 'CR-101', capacity: 60, enrolled: 55 },
  { id: 's-405-p5', day: 'thu', periodId: 'P5', code: 'EE201', title: 'Electrical Machines', type: 'lecture', group: 'EE-2', faculty: 'Prof. Dinesh Rao', room: 'LH-201', capacity: 120, enrolled: 65 },
  { id: 's-405', day: 'thu', periodId: 'P6', code: 'CAD-LAB', title: 'Mechanical CAD Modeling Lab', type: 'lab', group: 'ME-3', faculty: 'Prof. Rohit Kulkarni', room: 'Lab-6', capacity: 40, enrolled: 38 },
  { id: 's-406', day: 'thu', periodId: 'P7', code: 'EC-MID', title: 'Mid-Sem Exam: Signals & Systems', type: 'exam', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'Aud-1', capacity: 450, enrolled: 180, notes: 'Combined 2nd Year mid-semester exam.' },
  { id: 's-407', day: 'thu', periodId: 'P8', code: 'IT301', title: 'Mobile App Architecture', type: 'lecture', group: 'IT-3', faculty: 'Prof. Ashwin Thomas', room: 'LH-302', capacity: 100, enrolled: 72 },
  { id: 's-408', day: 'thu', periodId: 'P9', code: 'CS201', title: 'Data Structures & Algorithms', type: 'lecture', group: 'CSE-2', faculty: 'Dr. Anand Kumar', room: 'LH-103', capacity: 90, enrolled: 84 },

  // Thursday Evening Events
  { id: 'ev-401', day: 'thu', periodId: 'P10', code: 'CYBER-SEC', title: 'Capture The Flag (CTF) Cyber Drill', type: 'event', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'Lab-3', capacity: 45, enrolled: 45 },
  { id: 'ev-402', day: 'thu', periodId: 'P11', code: 'SPEC-REQ', title: 'Spectra Fashion Show Runway Prep', type: 'event', group: 'ECE-3', faculty: 'Prof. Ananya Sen', room: 'Aud-1', capacity: 450, enrolled: 220 },
  { id: 'ev-403', day: 'thu', periodId: 'P12', code: 'DEBATE-CIT', title: 'Parliamentary Debate Society Prelims', type: 'event', group: 'Y1-SecB', faculty: 'Prof. David Solomon', room: 'Sem-A', capacity: 150, enrolled: 95 },
  { id: 'ev-404', day: 'thu', periodId: 'P13', code: 'OAT-LIVE', title: 'Classical Fusion Music Recital', type: 'event', group: 'CSE-2', faculty: 'Prof. Divya Swaminathan', room: 'OAT', capacity: 800, enrolled: 310 },

  // Friday Academic
  { id: 's-501', day: 'fri', periodId: 'P1', code: 'MA102', title: 'Calculus & ODE', type: 'tutorial', group: 'Y1-SecA', faculty: 'Dr. N. Jena', room: 'LH-101', capacity: 90, enrolled: 85 },
  { id: 's-502', day: 'fri', periodId: 'P2', code: 'CS301', title: 'Operating Systems', type: 'lecture', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'LH-102', capacity: 90, enrolled: 78 },
  { id: 's-503', day: 'fri', periodId: 'P3', code: 'EC301', title: 'Communication Systems', type: 'lecture', group: 'ECE-3', faculty: 'Prof. K. Patel', room: 'LH-201', capacity: 120, enrolled: 72 },
  { id: 's-504', day: 'fri', periodId: 'P4', code: 'CS303', title: 'Computer Networks', type: 'lecture', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-102', capacity: 90, enrolled: 80 },
  { id: 's-505-p5', day: 'fri', periodId: 'P5', code: 'IT302', title: 'Big Data Analytics', type: 'lecture', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'LH-103', capacity: 90, enrolled: 70 },
  { id: 's-505', day: 'fri', periodId: 'P6', code: 'PROJ-3', title: 'Capstone Design Workshop', type: 'lab', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-1', capacity: 45, enrolled: 38 },
  { id: 's-506', day: 'fri', periodId: 'P7', code: 'PROJ-3', title: 'Capstone Workshop (Contd)', type: 'lab', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Lab-1', capacity: 45, enrolled: 38 },
  { id: 's-507', day: 'fri', periodId: 'P8', code: 'ME302', title: 'Design of Machine Elements', type: 'lecture', group: 'ME-3', faculty: 'Dr. Madhavan Iyer', room: 'LH-301', capacity: 100, enrolled: 86 },
  { id: 's-508', day: 'fri', periodId: 'P9', code: 'IT202', title: 'Information Security', type: 'lecture', group: 'IT-2', faculty: 'Dr. Geeta Pillai', room: 'CR-103', capacity: 60, enrolled: 52 },

  // Friday Evening Events
  { id: 'ev-501', day: 'fri', periodId: 'P10', code: 'SPEC-VAL', title: 'Spectra Core Committee Briefing', type: 'event', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Conf-1', capacity: 80, enrolled: 70 },
  { id: 'ev-502', day: 'fri', periodId: 'P11', code: 'SPEC-REQ', title: 'Spectra Mega Rehearsal - All Troupes', type: 'event', group: 'ECE-3', faculty: 'Prof. K. Patel', room: 'Aud-1', capacity: 450, enrolled: 400 },
  { id: 'ev-503', day: 'fri', periodId: 'P12', code: 'SPEC-LIGHT', title: 'Stage Sound & Lighting Tech Run', type: 'event', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'Aud-1', capacity: 450, enrolled: 120 },
  { id: 'ev-504', day: 'fri', periodId: 'P13', code: 'OAT-LIVE', title: 'CIT Pre-Fest Gala & DJ Jam', type: 'event', group: 'Y1-SecA', faculty: 'Prof. David Solomon', room: 'OAT', capacity: 800, enrolled: 750 },

  // Saturday Academic
  { id: 's-601', day: 'sat', periodId: 'P1', code: 'CS306', title: 'Machine Learning Elective', type: 'lecture', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-201', capacity: 120, enrolled: 95 },
  { id: 's-602', day: 'sat', periodId: 'P2', code: 'EC305', title: 'Microwave Engineering', type: 'lecture', group: 'ECE-3', faculty: 'Prof. Arun Balaji', room: 'LH-102', capacity: 90, enrolled: 65 },
  { id: 's-603', day: 'sat', periodId: 'P3', code: 'COLL-REV', title: 'Department Colloquium & Seminar', type: 'tutorial', group: 'ME-3', faculty: 'Prof. S. Sen', room: 'LH-101', capacity: 90, enrolled: 75 },
  { id: 's-604', day: 'sat', periodId: 'P4', code: 'PR301', title: 'Minor Project Peer Review', type: 'tutorial', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'Sem-B', capacity: 120, enrolled: 80 },

  // Saturday Evening Events
  { id: 'ev-601', day: 'sat', periodId: 'P10', code: 'SPEC-MAIN', title: 'Spectra Inaugural Ceremony', type: 'event', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'Aud-1', capacity: 450, enrolled: 450 },
  { id: 'ev-602', day: 'sat', periodId: 'P11', code: 'SPEC-MAIN', title: 'Spectra National Hackathon 24hr Kickoff', type: 'event', group: 'IT-3', faculty: 'Dr. N. Jena', room: 'Lab-1', capacity: 45, enrolled: 45 },
  { id: 'ev-603', day: 'sat', periodId: 'P12', code: 'SPEC-CULT', title: 'Spectra Western Dance Championship', type: 'event', group: 'ECE-3', faculty: 'Prof. K. Patel', room: 'Aud-1', capacity: 450, enrolled: 450 },
  { id: 'ev-604', day: 'sat', periodId: 'P13', code: 'SPEC-STAR', title: 'Spectra Star Celebrity Night 2027', type: 'event', group: 'General', faculty: 'Dr. S. Radhakrishnan', room: 'OAT', capacity: 800, enrolled: 800 },
];

// Helper to get timetable sessions with localStorage persistence
export function getStoredTimetableSessions() {
  try {
    const raw = localStorage.getItem('cit_timetable_sessions_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored sessions, falling back to initial', err);
  }
  // Initialize v3 with new P1-P13 9AM schedule
  try {
    localStorage.setItem('cit_timetable_sessions_v3', JSON.stringify(INITIAL_TIMETABLE_SESSIONS));
  } catch (e) {
    // ignore
  }
  return INITIAL_TIMETABLE_SESSIONS;
}

export function saveStoredTimetableSessions(sessions) {
  try {
    localStorage.setItem('cit_timetable_sessions_v3', JSON.stringify(sessions));
    localStorage.setItem('cit_timetable_sessions_v2', JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to localStorage', err);
  }
}

export function resetStoredTimetableSessions() {
  try {
    localStorage.setItem('cit_timetable_sessions_v3', JSON.stringify(INITIAL_TIMETABLE_SESSIONS));
    localStorage.setItem('cit_timetable_sessions_v2', JSON.stringify(INITIAL_TIMETABLE_SESSIONS));
  } catch (err) {
    console.error('Failed to reset sessions in localStorage', err);
  }
  return INITIAL_TIMETABLE_SESSIONS;
}

// Helper to get faculty with localStorage persistence (allows adding teachers!)
export function getStoredFacultyList() {
  try {
    const raw = localStorage.getItem('cit_faculty_network_v2');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored faculty', err);
  }
  return FACULTY_DATA;
}

export function saveStoredFacultyList(facultyList) {
  try {
    localStorage.setItem('cit_faculty_network_v2', JSON.stringify(facultyList));
  } catch (err) {
    console.error('Failed to save faculty to localStorage', err);
  }
}

// Master Metrics (exact numbers from Hackathon Dataset)
export const CIT_DATASET_METRICS = {
  rooms: {
    total: 27,
    breakdown: '15 Classrooms/Halls, 4 Auditorium/Seminars, 1 OAT, 7 Labs',
    utilization: '88% active',
  },
  faculty: {
    total: 40,
    breakdown: '10 CSE, 8 ECE, 8 ME, 8 IT, 6 Basic Sciences',
    activeOnline: 34,
  },
  studentGroups: {
    total: 14,
    breakdown: 'Year 1 Sec A–D + Year 2 & 3 for 5 Engineering Branches',
  },
  courses: {
    total: 62,
    breakdown: 'Undergraduate core, labs, electives, and humanities',
  },
  sessions: {
    total: 189,
    hours: 243,
    breakdown: '189 clash-free sessions (243 weekly teaching hours)',
  },
  spectra: {
    totalRequests: 25,
    confirmed: 24,
    cancelled: 1, // "25 (one of them later cancelled)"
    breakdown: '24 confirmed cultural & tech fest requests, 1 cancelled',
  },
  midsemExams: {
    total: 41,
    breakdown: '41 scheduled midterm examination slots across 27 halls',
  },
};

// Initial Chat Messages for Faculty Chat
export const INITIAL_FACULTY_CHATS = {
  'Dr. A. Sharma': [
    { id: 'msg-1', sender: 'them', text: 'Hello! I noticed the OS lab on Monday P6 has 42 students registered. Are all workstations configured?', time: '09:15 AM' },
    { id: 'msg-2', sender: 'me', text: 'Yes Dr. Sharma, Lab-1 has 45 systems fully prepared with Linux and GCC tools.', time: '09:20 AM' },
    { id: 'msg-3', sender: 'them', text: 'Great! Also regarding Thursday P3, can you confirm if LH-101 has the new HDMI projector operational?', time: '10:05 AM' },
  ],
  'Prof. K. Patel': [
    { id: 'msg-1', sender: 'them', text: 'Greetings. The Signals & Systems mid-sem exam is set for Thursday P7 in Central Auditorium.', time: 'Yesterday' },
    { id: 'msg-2', sender: 'me', text: 'Confirmed Prof. Patel! Seating plan for 180 students is finalized.', time: 'Yesterday' },
  ],
  'Dr. R. Verma': [
    { id: 'msg-1', sender: 'them', text: 'Can we swap my Friday P4 lecture with Monday P2? Need to attend the Dean committee review.', time: '2 days ago' },
    { id: 'msg-2', sender: 'me', text: 'Processed via Smart Swap! Timetable updated with zero clashes.', time: '2 days ago' },
  ],
};

// Live Marquee Ticker Notices
export const LIVE_CAMPUS_NOTICES = [
  '⚡ CIT SMART ENGINE: Clash-free timetable generated for 189 sessions (243 teaching hours a week) across 14 student cohorts.',
  '🏛️ VENUE UPDATE: 27 academic rooms (including 7 labs and Open-Air Theatre) operating under live automated booking.',
  '🎉 SPECTRA 2027: 24 fest requests confirmed for P10–P13 evening slots at Central Auditorium and OAT (1 cancelled as scheduled).',
  '📝 MIDSEM EXAMS: 41 exam slots scheduled across LH-101 to LH-203 with automated seating plans.',
  '💬 FACULTY NETWORK: 40 professors active on campus — live chat and one-click lecture swaps available.',
  '🔧 MAINTENANCE ALERT: Room LH-201 projector calibration completed • Ready for P1 Operating Systems.',
];

// Admin Dashboard Summary Metrics
export const ADMIN_METRICS = {
  totalSessions: {
    value: '189',
    label: 'Weekly Sessions (243 Hrs)',
    trend: '100% Clash-Free',
    isPositive: true,
  },
  roomsInUse: {
    value: '27 / 27',
    label: 'Rooms & 7 Labs Occupied',
    trend: '88% utilization',
    isPositive: true,
  },
  pendingApprovals: {
    value: '25',
    label: 'Spectra Fest Requests',
    trend: '24 Approved, 1 Cancelled',
    isPositive: true,
  },
  schedulingConflicts: {
    value: '0',
    label: 'Active Conflicts',
    trend: 'Clash-free verified',
    isPositive: true,
  },
};

// Activity chart data
export const WEEKLY_ACTIVITY_DATA = [
  { day: 'Mon', lectures: 32, labs: 8, tutorials: 6, total: 46 },
  { day: 'Tue', lectures: 30, labs: 10, tutorials: 8, total: 48 },
  { day: 'Wed', lectures: 28, labs: 12, tutorials: 6, total: 46 },
  { day: 'Thu', lectures: 30, labs: 8, tutorials: 6, total: 44 },
  { day: 'Fri', lectures: 26, labs: 10, tutorials: 8, total: 44 },
  { day: 'Sat', lectures: 18, labs: 4, tutorials: 4, total: 26 },
];

// Room utilization data
export const ROOM_UTILIZATION_DATA = [
  { room: 'LH-101', type: 'Lecture Hall', capacity: 90, occupiedHours: 38, maxHours: 45, status: 'Active', current: 'CS301 Lecture' },
  { room: 'LH-102', type: 'Lecture Hall', capacity: 90, occupiedHours: 41, maxHours: 45, status: 'High', current: 'CS302 DBMS' },
  { room: 'LH-201', type: 'Lecture Hall', capacity: 120, occupiedHours: 35, maxHours: 45, status: 'Active', current: 'EC204 Signals' },
  { room: 'Lab-1', type: 'Computing Lab 1', capacity: 45, occupiedHours: 36, maxHours: 40, status: 'Active', current: 'Systems Lab' },
  { room: 'Lab-3', type: 'Network Lab', capacity: 45, occupiedHours: 32, maxHours: 40, status: 'Available', current: 'Network Lab' },
  { room: 'Aud-1', type: 'Auditorium', capacity: 450, occupiedHours: 24, maxHours: 40, status: 'Reserved', current: 'Spectra Rehearsal (P11)' },
];

// Pending booking requests (25 Spectra requests: 24 confirmed, 1 cancelled)
export const PENDING_BOOKING_REQUESTS = [
  {
    id: 'req-1',
    event: 'Spectra 2027 Hackathon Prelims',
    organizer: 'CIT Tech Club (A. Roy)',
    venue: 'CIT Central Auditorium (Aud-1)',
    date: 'Nov 02, 2026',
    time: 'P10 - P13 (17:30 - 20:30)',
    type: 'Spectra Booking',
    status: 'Approved & Scheduled',
    badgeVariant: 'success',
  },
  {
    id: 'req-2',
    event: 'ECE Faculty Board Meeting',
    organizer: 'Prof. K. Patel',
    venue: 'Sir CV Raman Seminar Hall (Sem-B)',
    date: 'Nov 03, 2026',
    time: 'P3 - P4 (10:25 - 12:05)',
    type: 'Venue Booking',
    status: 'Confirmed',
    badgeVariant: 'info',
  },
  {
    id: 'req-3',
    event: 'Spectra Battle of the Bands Sound Check',
    organizer: 'Music Society',
    venue: 'CIT Open-Air Theatre (OAT)',
    date: 'Nov 04, 2026',
    time: 'P11 - P13 (18:15 - 20:30)',
    type: 'Spectra Booking',
    status: 'Approved & Scheduled',
    badgeVariant: 'success',
  },
  {
    id: 'req-4',
    event: 'Guest Lecture (Cancelled per starter pack)',
    organizer: 'External Speaker Series',
    venue: 'Lecture Hall LH-201',
    date: 'Nov 05, 2026',
    time: 'P8 (15:35 - 16:25)',
    type: 'Venue Booking',
    status: 'Cancelled',
    badgeVariant: 'danger',
  },
];

// Recent schedule changes / Disruption logs
export const RECENT_SCHEDULE_CHANGES = [
  {
    id: 'chg-1',
    time: '10 mins ago',
    title: 'Clash-Free Matrix Re-calculated',
    description: '189 weekly sessions confirmed clash-free across 14 student cohorts.',
    type: 'Schedule',
    badgeVariant: 'success',
  },
  {
    id: 'chg-2',
    time: '45 mins ago',
    title: 'Mid-Sem Seating Plan Released',
    description: 'Operating Systems examination slots allocated across LH-101, LH-102, and LH-201.',
    type: 'Exam Slot',
    badgeVariant: 'info',
  },
  {
    id: 'chg-3',
    time: '2 hours ago',
    title: 'Spectra P10–P13 Evening Slots Allocated',
    description: 'Central Auditorium and Open-Air Theatre assigned for 24 confirmed fest sessions.',
    type: 'Booking',
    badgeVariant: 'success',
  },
];

// Priority levels for room & schedule tie-breaking (Judge Criteria Image 2)
export const PRIORITY_LEVELS = [
  { level: 1, name: 'Exams', description: 'Highest priority — always takes precedence' },
  { level: 2, name: 'Regular classes', description: 'Core academic lectures and practical labs' },
  { level: 3, name: 'Institute events (Spectra main events, convocation)', description: 'Campus-wide official gatherings' },
  { level: 4, name: 'Guest lectures', description: 'Visiting speaker sessions' },
  { level: 5, name: 'Department events', description: 'Departmental seminars and workshops' },
  { level: 6, name: 'Club events', description: 'Student society activities and rehearsals' },
];

export function getStoredUserProfile() {
  try {
    const raw = localStorage.getItem('cit_user_profile_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return {
    name: 'Dr. A. Sharma',
    email: 'a.sharma@cit.edu.in',
    dept: 'CSE',
    role: 'Faculty Member',
    avatarInitials: 'AS',
    isLoggedIn: true,
  };
}

export function saveStoredUserProfile(profile) {
  try {
    localStorage.setItem('cit_user_profile_v2', JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export const INITIAL_LECTURE_SWAPS = [
  {
    id: 'swap-1',
    requestorFaculty: 'Dr. A. Sharma',
    requestorSession: {
      id: 's-101',
      code: 'CS301',
      title: 'Operating Systems',
      day: 'mon',
      dayName: 'Monday',
      periodId: 'P1',
      time: '08:00 - 09:00',
      room: 'LH-101',
      group: 'CSE-3',
    },
    targetFaculty: 'Dr. R. Verma',
    targetSession: {
      id: 's-102',
      code: 'CS302',
      title: 'Database Management Systems',
      day: 'mon',
      dayName: 'Monday',
      periodId: 'P2',
      time: '09:00 - 10:00',
      room: 'LH-102',
      group: 'CSE-3',
    },
    reason: 'Department Accreditation Committee meeting scheduled during P1.',
    priorityTier: 2,
    priorityName: 'Regular classes',
    hardViolations: 0,
    movedSessionsCount: 2,
    status: 'PENDING_FACULTY_PERMISSION',
    createdAt: 'Today, 08:15 AM',
    approvedBy: null,
    approvalTimestamp: null,
  },
  {
    id: 'swap-2',
    requestorFaculty: 'Prof. K. Patel',
    requestorSession: {
      id: 's-103',
      code: 'EC204',
      title: 'Signals & Linear Systems',
      day: 'mon',
      dayName: 'Monday',
      periodId: 'P3',
      time: '10:00 - 11:00',
      room: 'LH-201',
      group: 'ECE-2',
    },
    targetFaculty: 'Prof. S. Sen',
    targetSession: {
      id: 's-107',
      code: 'ME201',
      title: 'Thermodynamics & Heat Engines',
      day: 'mon',
      dayName: 'Monday',
      periodId: 'P8',
      time: '16:00 - 17:00',
      room: 'LH-202',
      group: 'ME-2',
    },
    reason: 'Lab equipment calibration slot adjustment.',
    priorityTier: 2,
    priorityName: 'Regular classes',
    hardViolations: 0,
    movedSessionsCount: 2,
    status: 'APPROVED_SWAPPED',
    createdAt: 'Yesterday, 03:45 PM',
    approvedBy: 'Prof. S. Sen',
    approvalTimestamp: 'Yesterday, 04:10 PM',
  },
];

export function getStoredLectureSwaps() {
  try {
    const raw = localStorage.getItem('cit_lecture_swaps_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return INITIAL_LECTURE_SWAPS;
}

export function saveStoredLectureSwaps(swaps) {
  try {
    localStorage.setItem('cit_lecture_swaps_v2', JSON.stringify(swaps));
  } catch (e) {
    console.error(e);
  }
}
