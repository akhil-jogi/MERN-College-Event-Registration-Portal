import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get("/registrations");
        setRegistrations(response.data.registrations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h2>Welcome, {user?.name || "Student"}</h2>
          <p className="muted">Your student activity at a glance.</p>
        </div>

        <Link to="/events" className="primary-button">
          Explore Events
        </Link>
      </div>

      <div className="event-grid">
        <article className="panel">
          <p className="muted">My Registrations</p>
          <h2>{loading ? "..." : registrations.length}</h2>
        </article>

        <article className="panel">
          <p className="muted">Account Type</p>
          <h2>Student</h2>
        </article>

        <article className="panel">
          <p className="muted">Portal</p>
          <h2>CampusConnect</h2>
        </article>
      </div>

      <div className="section-heading">
        <h2>Recent Registrations</h2>
        <Link to="/my-registrations">View All</Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!loading && registrations.length === 0 && (
        <div className="empty-state">
          You have not registered for any events yet.
          <p><Link to="/events">Explore upcoming events</Link></p>
        </div>
      )}

      <div className="event-grid">
        {registrations.slice(0, 3).map((registration) => {
          const event = registration.eventId;

          if (!event) return null;

          return (
            <article className="event-card" key={registration._id}>
              <span className="event-category">{event.category}</span>
              <h3>{event.eventTitle}</h3>
              <p className="muted">
                Status: {registration.participationStatus}
              </p>
              <p className="muted">
                Registered:{" "}
                {new Date(registration.registrationDate).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default StudentDashboard;