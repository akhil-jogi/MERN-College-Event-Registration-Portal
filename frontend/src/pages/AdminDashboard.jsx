import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, PlusCircle, ClipboardList } from "lucide-react";
import api from "../services/api";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > new Date()
  );

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="muted">
            Manage college events and monitor registrations.
          </p>
        </div>

        <Link to="/manage-events" className="primary-button">
          <PlusCircle size={17} />
          Manage Events
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="event-grid">
        <article className="panel">
          <CalendarDays color="#4f46e5" size={28} />
          <p className="muted">Total Events</p>
          <h2>{loading ? "..." : events.length}</h2>
        </article>

        <article className="panel">
          <ClipboardList color="#4f46e5" size={28} />
          <p className="muted">Upcoming Events</p>
          <h2>{loading ? "..." : upcomingEvents.length}</h2>
        </article>

        <article className="panel">
          <Users color="#4f46e5" size={28} />
          <p className="muted">Admin Access</p>
          <h2>Active</h2>
        </article>
      </div>

      <div className="section-heading">
        <h2>Recently Available Events</h2>
        <Link to="/manage-events">View All</Link>
      </div>

      {!loading && events.length === 0 && (
        <div className="empty-state">
          No events have been created yet.
        </div>
      )}

      <div className="event-grid">
        {events.slice(0, 3).map((event) => (
          <article className="event-card" key={event._id}>
            <span className="event-category">{event.category}</span>
            <h3>{event.eventTitle}</h3>

            <div className="event-meta">
              <span>
                Date:{" "}
                {new Date(event.eventDate).toLocaleDateString("en-IN")}
              </span>
              <span>Venue: {event.venue}</span>
              <span>Capacity: {event.maximumParticipants}</span>
            </div>

            <Link
              to={`/admin/reports/${event._id}`}
              className="secondary-button full-width"
            >
              View Event Report
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default AdminDashboard;