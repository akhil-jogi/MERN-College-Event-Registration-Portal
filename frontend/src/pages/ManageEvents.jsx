import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import api from "../services/api";

const initialForm = {
  eventTitle: "",
  category: "Technical",
  eventDate: "",
  venue: "",
  organizer: "",
  maximumParticipants: "",
};

function toDateTimeLocal(dateValue) {
  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setForm({
      eventTitle: event.eventTitle,
      category: event.category,
      eventDate: toDateTimeLocal(event.eventDate),
      venue: event.venue,
      organizer: event.organizer,
      maximumParticipants: event.maximumParticipants,
    });

    setEditingId(event._id);
    setError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const payload = {
      ...form,
      maximumParticipants: Number(form.maximumParticipants),
    };

    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
        setMessage("Event updated successfully.");
      } else {
        await api.post("/events", payload);
        setMessage("Event created successfully.");
      }

      closeForm();
      await fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Delete this event? Its associated registrations will also be deleted."
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await api.delete(`/events/${eventId}`);
      setMessage(response.data.message || "Event deleted successfully.");
      await fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete event");
    }
  };

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h2>Manage Events</h2>
          <p className="muted">
            Create, update and manage college events.
          </p>
        </div>

        <button className="primary-button" onClick={openCreateForm}>
          <PlusCircle size={17} />
          Add Event
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="form-card event-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h2>{editingId ? "Edit Event" : "Create New Event"}</h2>

            <button
              type="button"
              className="secondary-button"
              onClick={closeForm}
              aria-label="Close form"
            >
              <X size={17} />
            </button>
          </div>

          <div className="form-group">
            <label>Event Title</label>
            <input
              name="eventTitle"
              value={form.eventTitle}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option>Technical</option>
              <option>Cultural</option>
              <option>Workshop</option>
              <option>Sports</option>
              <option>Seminar</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Date and Time</label>
            <input
              type="datetime-local"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              min={toDateTimeLocal(new Date())}
              required
            />
          </div>

          <div className="form-group">
            <label>Venue</label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="Enter venue"
              required
            />
          </div>

          <div className="form-group">
            <label>Organizer</label>
            <input
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              placeholder="Enter organizer"
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Participants</label>
            <input
              type="number"
              name="maximumParticipants"
              value={form.maximumParticipants}
              onChange={handleChange}
              min="1"
              placeholder="Enter capacity"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Event"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="section-heading">
        <h2>All Events ({events.length})</h2>
      </div>

      {loading && <p className="muted">Loading events...</p>}

      {!loading && events.length === 0 && (
        <div className="empty-state">
          No events available. Select Add Event to create one.
        </div>
      )}

      <div className="event-grid">
        {events.map((event) => (
          <article className="event-card" key={event._id}>
            <span className="event-category">{event.category}</span>
            <h3>{event.eventTitle}</h3>

            <div className="event-meta">
              <span>
                Date:{" "}
                {new Date(event.eventDate).toLocaleString("en-IN")}
              </span>
              <span>Venue: {event.venue}</span>
              <span>Organizer: {event.organizer}</span>
              <span>Capacity: {event.maximumParticipants}</span>
            </div>

            <div className="admin-card-actions">
              <button
                className="secondary-button"
                onClick={() => openEditForm(event)}
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                className="danger-button"
                onClick={() => handleDelete(event._id)}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>

            <Link
              to={`/admin/reports/${event._id}`}
              className="primary-button full-width"
              style={{ marginTop: 12 }}
            >
              View Report & Participants
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default ManageEvents;