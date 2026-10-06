import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <CalendarDays size={21} />
          </span>
          <span>CampusConnect</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>

          {user?.role === "student" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/my-registrations">My Registrations</Link>
              <Link to="/change-password">Change Password</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin">Admin Dashboard</Link>
              <Link to="/manage-events">Manage Events</Link>
              <Link to="/change-password">Change Password</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="nav-login">
                Login
              </Link>

              <Link to="/register" className="nav-register">
                Get Started
              </Link>
            </>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;