import { useEffect, useState } from "react";
import api from "../services/api";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRegistrations = async () => {
    try {
      const response = await api.get("/registrations");
      setRegistrations(response.data.registrations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (registrationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this event registration?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await api.delete(
        `/registrations/${registrationId}`
      );

      setMessage(response.data.message || "Registration cancelled");
      await fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel registration");
    }
  };

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h2>My Registrations</h2>
          <p className="muted">
            Manage the events you have registered for.
          </p>
        </div>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {loading && <p className="muted">Loading registrations...</p>}

      {!loading && registrations.length === 0 && (
        <div className="empty-state">
          No registrations found.
        </div>
      )}

      <div className="event-grid">
        {registrations.map((registration) => {
          const event = registration.eventId;

          if (!event) return null;

          return (
            <article className="event-card" key={registration._id}>
              <span className="event-category">{event.category}</span>
              <h3>{event.eventTitle}</h3>

              <div className="event-meta">
                <span>
                  Date:{" "}
                  {new Date(event.eventDate).toLocaleDateString("en-IN")}
                </span>
                <span>Venue: {event.venue}</span>
                <span>Organizer: {event.organizer}</span>
                <span>Status: {registration.participationStatus}</span>
              </div>

              <button
                className="danger-button full-width"
                onClick={() => handleCancel(registration._id)}
              >
                Cancel Registration
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default MyRegistrations;