import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, Search } from "lucide-react";
import api from "../services/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(events.map((event) => event.category))],
    [events]
  );

  const filteredEvents = events.filter((event) => {
    const text = `${event.eventTitle} ${event.organizer} ${event.venue}`.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (category === "All" || event.category === category)
    );
  });

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h2>Explore College Events</h2>
          <p className="muted">Find an event and reserve your participation.</p>
        </div>
      </div>

      <div className="search-box">
        <Search size={19} color="#64748b" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, venue or organizer..."
        />
      </div>

      <div className="category-list">
        {categories.map((item) => (
          <button
            key={item}
            className={`category-button ${category === item ? "active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading events...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && filteredEvents.length === 0 && (
        <div className="empty-state">No matching events found.</div>
      )}

      <div className="event-grid">
        {filteredEvents.map((event) => (
          <article className="event-card" key={event._id}>
            <span className="event-category">{event.category}</span>
            <h3>{event.eventTitle}</h3>

            <div className="event-meta">
              <span>
                <CalendarDays size={16} />
                {formatDate(event.eventDate)}
              </span>
              <span>
                <MapPin size={16} />
                {event.venue}
              </span>
              <span>
                <Users size={16} />
                Capacity: {event.maximumParticipants}
              </span>
            </div>

            <p className="muted">Organizer: {event.organizer}</p>

            <Link
              to={`/events/${event._id}`}
              className="primary-button full-width"
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Events;