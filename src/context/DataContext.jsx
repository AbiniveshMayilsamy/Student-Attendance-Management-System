import { createContext, useContext, useState } from 'react';
import {
  STUDENTS as S, TEACHERS as T, CLASSES as C,
  SUBJECTS as SB, ATTENDANCE_RECORDS as AR, SETTINGS as ST
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [students, setStudents] = useState(S);
  const [teachers, setTeachers] = useState(T);
  const [classes, setClasses] = useState(C);
  const [subjects, setSubjects] = useState(SB);
  const [attendance, setAttendance] = useState(AR);
  const [settings, setSettings] = useState(ST);

  const addStudent = (s) => setStudents(p => [...p, { ...s, id: Date.now() }]);
  const updateStudent = (id, data) => setStudents(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteStudent = (id) => setStudents(p => p.filter(s => s.id !== id));

  const addTeacher = (t) => setTeachers(p => [...p, { ...t, id: Date.now() }]);
  const updateTeacher = (id, data) => setTeachers(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTeacher = (id) => setTeachers(p => p.filter(t => t.id !== id));

  const addClass = (c) => setClasses(p => [...p, { ...c, id: Date.now() }]);
  const updateClass = (id, data) => setClasses(p => p.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteClass = (id) => setClasses(p => p.filter(c => c.id !== id));

  const addSubject = (s) => setSubjects(p => [...p, { ...s, id: Date.now() }]);
  const updateSubject = (id, data) => setSubjects(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteSubject = (id) => setSubjects(p => p.filter(s => s.id !== id));

  const saveAttendance = (records) => {
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.date === records[0]?.date && r.classId === records[0]?.classId && r.subjectId === records[0]?.subjectId));
      return [...filtered, ...records];
    });
  };

  const updateSettings = (data) => setSettings(p => ({ ...p, ...data }));

  return (
    <DataContext.Provider value={{
      students, teachers, classes, subjects, attendance, settings,
      addStudent, updateStudent, deleteStudent,
      addTeacher, updateTeacher, deleteTeacher,
      addClass, updateClass, deleteClass,
      addSubject, updateSubject, deleteSubject,
      saveAttendance, updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
