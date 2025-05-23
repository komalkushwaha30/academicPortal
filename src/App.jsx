// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AdminPanel from "./pages/AdminPanel";
import NoticeBoard from "./pages/NoticeBoard";
import AdminNoticePanel from "./pages/AdminPanel";
import ModulePage from "./pages/ModulePage";
import QuizPage from "./pages/QuizPage";
import ModuleQuiz from "./pages/ModuleQuiz";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import DiscussionZone from "./pages/DiscussionZone";
import NotFound from "./pages/NotFound";

import "./index.css";

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth(); // <-- use loading from AuthContext
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  if (loading) return <div className="container">Loading...</div>; // <-- block rendering until auth is ready

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/notices"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <NoticeBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminNoticePanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/module/:moduleId"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ModulePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/discussion"
            element={
              <PrivateRoute>
                <DiscussionZone />
              </PrivateRoute>
            }
          />
          <Route
            path="/module/:moduleId/quiz"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ModuleQuiz />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
