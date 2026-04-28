// Mock data for the entire application

export const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@school.com', password: 'admin123', role: 'admin', avatar: null },
  { id: 2, name: 'John Smith', email: 'teacher@school.com', password: 'teacher123', role: 'teacher', subjects: [1, 2], classes: [1, 2], avatar: null },
  { id: 3, name: 'Jane Doe', email: 'teacher2@school.com', password: 'teacher123', role: 'teacher', subjects: [3], classes: [3], avatar: null },
  { id: 4, name: 'Alice Johnson', email: 'student@school.com', password: 'student123', role: 'student', rollNo: 'CS001', classId: 1, avatar: null },
];

export const CLASSES = [
  { id: 1, name: 'Class 10-A', batch: '2024-25', strength: 35 },
  { id: 2, name: 'Class 10-B', batch: '2024-25', strength: 32 },
  { id: 3, name: 'Class 11-A', batch: '2024-25', strength: 30 },
];

export const SUBJECTS = [
  { id: 1, name: 'Mathematics', classId: 1, teacherId: 2 },
  { id: 2, name: 'Physics', classId: 2, teacherId: 2 },
  { id: 3, name: 'Chemistry', classId: 3, teacherId: 3 },
  { id: 4, name: 'English', classId: 1, teacherId: 2 },
];

export const STUDENTS = [
  { id: 1, name: 'Alice Johnson', rollNo: 'CS001', classId: 1, email: 'alice@school.com', phone: '9876543210', photo: null },
  { id: 2, name: 'Bob Williams', rollNo: 'CS002', classId: 1, email: 'bob@school.com', phone: '9876543211', photo: null },
  { id: 3, name: 'Carol Davis', rollNo: 'CS003', classId: 1, email: 'carol@school.com', phone: '9876543212', photo: null },
  { id: 4, name: 'David Brown', rollNo: 'CS004', classId: 2, email: 'david@school.com', phone: '9876543213', photo: null },
  { id: 5, name: 'Eva Martinez', rollNo: 'CS005', classId: 2, email: 'eva@school.com', phone: '9876543214', photo: null },
  { id: 6, name: 'Frank Wilson', rollNo: 'CS006', classId: 3, email: 'frank@school.com', phone: '9876543215', photo: null },
  { id: 7, name: 'Grace Lee', rollNo: 'CS007', classId: 3, email: 'grace@school.com', phone: '9876543216', photo: null },
  { id: 8, name: 'Henry Taylor', rollNo: 'CS008', classId: 1, email: 'henry@school.com', phone: '9876543217', photo: null },
];

export const TEACHERS = [
  { id: 2, name: 'John Smith', email: 'teacher@school.com', phone: '9876540001', subjects: [1, 2, 4], classes: [1, 2] },
  { id: 3, name: 'Jane Doe', email: 'teacher2@school.com', phone: '9876540002', subjects: [3], classes: [3] },
];

// Generate attendance records for the past 30 days
const generateAttendance = () => {
  const records = [];
  const today = new Date();
  let id = 1;
  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];
    STUDENTS.forEach(student => {
      const rand = Math.random();
      records.push({
        id: id++,
        studentId: student.id,
        classId: student.classId,
        subjectId: student.classId,
        date: dateStr,
        status: rand > 0.15 ? 'present' : rand > 0.05 ? 'late' : 'absent',
      });
    });
  }
  return records;
};

export const ATTENDANCE_RECORDS = generateAttendance();

export const SETTINGS = {
  schoolName: 'Greenwood High School',
  academicYear: '2024-25',
  lowAttendanceThreshold: 75,
};
