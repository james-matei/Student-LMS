import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../auth/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected area (for now simple) */}
        <Route path="/student" element={ <ProtectedRoute role="ROLE_STUDENT">
              <StudentDashboard />
            </ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute role="ROLE_TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>} />
        <Route path="/admin" element={ <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;