import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ChangePassword from "./pages/ChangePassword";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import StudentDashboard from "./pages/StudentDashboard";
import MyRegistrations from "./pages/MyRegistrations";
import AdminDashboard from "./pages/AdminDashboard";
import ManageEvents from "./pages/ManageEvents";
import EventReport from "./pages/EventReport";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
              path="/dashboard"
               element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute role="student">
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
           <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-events"
            element={
              <ProtectedRoute role="admin">
                <ManageEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports/:id"
            element={
              <ProtectedRoute role="admin">
                <EventReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<h2 className="page-container">Page not found</h2>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;