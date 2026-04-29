import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  const [students,   setStudents]   = useState([]);
  const [teachers,   setTeachers]   = useState([]);
  const [classes,    setClasses]    = useState([]);
  const [subjects,   setSubjects]   = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [settings,   setSettings]   = useState({ schoolName: '', academicYear: '', lowAttendanceThreshold: 75 });
  const [loading,    setLoading]    = useState(false);

  // Fetch all base data when user logs in
  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [s, t, c, sb, st] = await Promise.all([
        api.getStudents(),
        api.getTeachers(),
        api.getClasses(),
        api.getSubjects(),
        api.getSettings(),
      ]);
      setStudents(s);
      setTeachers(t);
      setClasses(c);
      setSubjects(sb);
      setSettings(st);
    } catch (err) {
      console.error('Failed to load data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Fetch attendance with optional filters
  const fetchAttendance = useCallback(async (params = {}) => {
    try {
      const records = await api.getAttendance(params);
      setAttendance(records);
      return records;
    } catch (err) {
      console.error('Failed to load attendance:', err.message);
      return [];
    }
  }, []);

  // Students
  const addStudent = async (data) => {
    const s = await api.addStudent(data);
    setStudents(p => [...p, s]);
  };
  const updateStudent = async (id, data) => {
    const s = await api.updateStudent(id, data);
    setStudents(p => p.map(x => x._id === id ? s : x));
  };
  const deleteStudent = async (id) => {
    await api.deleteStudent(id);
    setStudents(p => p.filter(x => x._id !== id));
  };

  // Teachers
  const addTeacher = async (data) => {
    const t = await api.addTeacher(data);
    setTeachers(p => [...p, t]);
  };
  const updateTeacher = async (id, data) => {
    const t = await api.updateTeacher(id, data);
    setTeachers(p => p.map(x => x._id === id ? t : x));
  };
  const deleteTeacher = async (id) => {
    await api.deleteTeacher(id);
    setTeachers(p => p.filter(x => x._id !== id));
  };

  // Classes
  const addClass = async (data) => {
    const c = await api.addClass(data);
    setClasses(p => [...p, c]);
  };
  const updateClass = async (id, data) => {
    const c = await api.updateClass(id, data);
    setClasses(p => p.map(x => x._id === id ? c : x));
  };
  const deleteClass = async (id) => {
    await api.deleteClass(id);
    setClasses(p => p.filter(x => x._id !== id));
  };

  // Subjects
  const addSubject = async (data) => {
    const s = await api.addSubject(data);
    setSubjects(p => [...p, s]);
  };
  const updateSubject = async (id, data) => {
    const s = await api.updateSubject(id, data);
    setSubjects(p => p.map(x => x._id === id ? s : x));
  };
  const deleteSubject = async (id) => {
    await api.deleteSubject(id);
    setSubjects(p => p.filter(x => x._id !== id));
  };

  // Attendance
  const saveAttendance = async (records) => {
    await api.saveAttendance(records);
    // Refresh attendance cache after save
    if (records.length > 0) {
      await fetchAttendance({ classId: records[0].classId, date: records[0].date });
    }
  };

  // Settings
  const updateSettings = async (data) => {
    const s = await api.updateSettings(data);
    setSettings(s);
  };

  return (
    <DataContext.Provider value={{
      students, teachers, classes, subjects, attendance, settings, loading,
      fetchAttendance,
      addStudent, updateStudent, deleteStudent,
      addTeacher, updateTeacher, deleteTeacher,
      addClass,   updateClass,   deleteClass,
      addSubject, updateSubject, deleteSubject,
      saveAttendance, updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
