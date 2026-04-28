import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StarfieldBackground from './components/StarfieldBackground';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import StudentsList from './pages/students/StudentsList';
import StudentProfile from './pages/students/StudentProfile';
import MarkAttendance from './pages/attendance/MarkAttendance';
import AttendanceRecords from './pages/attendance/AttendanceRecords';
import ClassesPage from './pages/classes/ClassesPage';
import TeachersPage from './pages/teachers/TeachersPage';
import Reports from './pages/reports/Reports';
import Profile from './pages/settings/Profile';
import SystemSettings from './pages/settings/SystemSettings';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <StarfieldBackground />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<ProtectedRoute roles={['admin']}><StudentsList /></ProtectedRoute>} />
              <Route path="students/:id" element={<ProtectedRoute roles={['admin']}><StudentProfile /></ProtectedRoute>} />
              <Route path="attendance/mark" element={<ProtectedRoute roles={['teacher', 'admin']}><MarkAttendance /></ProtectedRoute>} />
              <Route path="attendance/records" element={<AttendanceRecords />} />
              <Route path="classes" element={<ProtectedRoute roles={['admin']}><ClassesPage /></ProtectedRoute>} />
              <Route path="teachers" element={<ProtectedRoute roles={['admin']}><TeachersPage /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute roles={['admin', 'teacher']}><Reports /></ProtectedRoute>} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<ProtectedRoute roles={['admin']}><SystemSettings /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
