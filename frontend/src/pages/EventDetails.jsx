import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get("/events");
        const found = (response.data.events || []).find(
          (item) => item._id === id
        );

        if (!found) {
          setError("Event not found");
        } else {
          setEvent(found);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      setError("Only student accounts can register for events.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/registrations", {
        eventId: event._id,
      });

      setMessage(response.data.message || "Registration successful");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="page-container">Loading event...</main>;
  }

  if (!event) {
    return (
      <main className="page-container">
        <p className="error-message">{error || "Event not found"}</p>
        <Link to="/events">Back to Events</Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <article className="panel">
        <span className="event-category">{event.category}</span>
        <h1>{event.eventTitle}</h1>

        <div className="event-meta">
          <span>
            <CalendarDays size={17} />
            {new Date(event.eventDate).toLocaleString("en-IN", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>

          <span>
            <MapPin size={17} />
            {event.venue}
          </span>

          <span>
            <Users size={17} />
            Maximum participants: {event.maximumParticipants}
          </span>
        </div>

        <p><strong>Organizer:</strong> {event.organizer}</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {user?.role === "student" ? (
          <button
            className="primary-button"
            onClick={handleRegister}
            disabled={submitting || Boolean(message)}
          >
            {submitting
              ? "Registering..."
              : message
                ? "Registered"
                : "Register for Event"}
          </button>
        ) : !user ? (
          <Link to="/login" className="primary-button">
            Login to Register
          </Link>
        ) : (
          <p className="muted">Admin accounts cannot register as students.</p>
        )}

        <p style={{ marginTop: 20 }}>
          <Link to="/events">← Back to all events</Link>
        </p>
      </article>
    </main>
  );
}

export default EventDetails;