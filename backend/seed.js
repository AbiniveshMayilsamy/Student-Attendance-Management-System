require('dotenv').config();
const mongoose = require('mongoose');
const User       = require('./models/User');
const Student    = require('./models/Student');
const Teacher    = require('./models/Teacher');
const Class      = require('./models/Class');
const Subject    = require('./models/Subject');
const Attendance = require('./models/Attendance');
const Settings   = require('./models/Settings');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing collections...');

  await Promise.all([
    User.deleteMany(), Student.deleteMany(), Teacher.deleteMany(),
    Class.deleteMany(), Subject.deleteMany(), Attendance.deleteMany(), Settings.deleteMany(),
  ]);

  // Users
  const adminUser   = await User.create({ name: 'Admin User',    email: 'admin@school.com',    password: 'admin123',   role: 'admin' });
  const teacherUser = await User.create({ name: 'John Smith',    email: 'teacher@school.com',  password: 'teacher123', role: 'teacher' });
  const teacher2User= await User.create({ name: 'Jane Doe',      email: 'teacher2@school.com', password: 'teacher123', role: 'teacher' });
  const studentUser = await User.create({ name: 'Alice Johnson', email: 'student@school.com',  password: 'student123', role: 'student' });

  // Classes
  const [c1, c2, c3] = await Class.insertMany([
    { name: 'Class 10-A', batch: '2024-25', strength: 35 },
    { name: 'Class 10-B', batch: '2024-25', strength: 32 },
    { name: 'Class 11-A', batch: '2024-25', strength: 30 },
  ]);

  // Teachers
  const t1 = await Teacher.create({ name: 'John Smith',  email: 'teacher@school.com',  phone: '9876540001', userId: teacherUser._id, classes: [c1._id, c2._id] });
  const t2 = await Teacher.create({ name: 'Jane Doe',    email: 'teacher2@school.com', phone: '9876540002', userId: teacher2User._id, classes: [c3._id] });

  // Subjects
  const [s1, s2, s3, s4] = await Subject.insertMany([
    { name: 'Mathematics', classId: c1._id, teacherId: t1._id },
    { name: 'Physics',     classId: c2._id, teacherId: t1._id },
    { name: 'Chemistry',   classId: c3._id, teacherId: t2._id },
    { name: 'English',     classId: c1._id, teacherId: t1._id },
  ]);

  // Update teacher subjects
  await Teacher.findByIdAndUpdate(t1._id, { subjects: [s1._id, s2._id, s4._id] });
  await Teacher.findByIdAndUpdate(t2._id, { subjects: [s3._id] });

  // Students
  const studentsData = [
    { name: 'Alice Johnson', rollNo: 'CS001', classId: c1._id, email: 'student@school.com',  phone: '9876543210', userId: studentUser._id },
    { name: 'Bob Williams',  rollNo: 'CS002', classId: c1._id, email: 'bob@school.com',       phone: '9876543211' },
    { name: 'Carol Davis',   rollNo: 'CS003', classId: c1._id, email: 'carol@school.com',     phone: '9876543212' },
    { name: 'David Brown',   rollNo: 'CS004', classId: c2._id, email: 'david@school.com',     phone: '9876543213' },
    { name: 'Eva Martinez',  rollNo: 'CS005', classId: c2._id, email: 'eva@school.com',       phone: '9876543214' },
    { name: 'Frank Wilson',  rollNo: 'CS006', classId: c3._id, email: 'frank@school.com',     phone: '9876543215' },
    { name: 'Grace Lee',     rollNo: 'CS007', classId: c3._id, email: 'grace@school.com',     phone: '9876543216' },
    { name: 'Henry Taylor',  rollNo: 'CS008', classId: c1._id, email: 'henry@school.com',     phone: '9876543217' },
  ];
  const students = await Student.insertMany(studentsData);

  // Attendance — last 30 weekdays
  const subjectMap = { [c1._id]: s1._id, [c2._id]: s2._id, [c3._id]: s3._id };
  const attendanceRecords = [];
  const today = new Date();

  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];

    for (const student of students) {
      const rand = Math.random();
      attendanceRecords.push({
        studentId: student._id,
        classId:   student.classId,
        subjectId: subjectMap[student.classId],
        date:      dateStr,
        status:    rand > 0.15 ? 'present' : rand > 0.05 ? 'late' : 'absent',
      });
    }
  }
  await Attendance.insertMany(attendanceRecords);

  // Settings
  await Settings.create({ schoolName: 'Greenwood High School', academicYear: '2024-25', lowAttendanceThreshold: 75 });

  console.log('✅ Seed complete!');
  console.log('   Admin:   admin@school.com   / admin123');
  console.log('   Teacher: teacher@school.com / teacher123');
  console.log('   Student: student@school.com / student123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
