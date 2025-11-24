import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Login from './pages/Auth/login';
import Dashboard from './pages/Dashboard/dashboard';
import PrivateRoute from './routes/privateRoute';
import RegisterUser from './pages/Register/registerUser';
import ProfilePage from './pages/Profile/profilePage';
import ClassesPage from './pages/Classes/classesPage';
import Attendance from './pages/Attendance/attendancePage';
import GradePage from './pages/Grades/gradesPage';
import NoticesPage from './pages/Notices/noticesPage';
import AssignmentPage from './pages/Assignment/assignmentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />

          {/* Protected Route */}
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
          <Route path="/profile" element={ <PrivateRoute> <ProfilePage /> </PrivateRoute> } />
          <Route path="/classes" element={ <PrivateRoute> <ClassesPage /> </PrivateRoute> } />
          <Route path="/attendance" element={ <PrivateRoute> <Attendance /> </PrivateRoute> } />
          <Route path="/grades" element={ <PrivateRoute> <GradePage /> </PrivateRoute> } />
          <Route path="/notices" element={ <PrivateRoute> <NoticesPage /> </PrivateRoute> } />
          <Route path="/assignments" element={ <PrivateRoute> <AssignmentPage /> </PrivateRoute> } />
          
          {/* Default route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
