import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import api from "../services/api";

function EventReport() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/events/${id}/report`);
        setReport(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to generate report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <main className="page-container">Generating report...</main>;
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-message">{error}</p>
        <Link to="/manage-events">Back to Manage Events</Link>
      </main>
    );
  }

  if (!report) return null;

  return (
    <main className="page-container">
      <div className="section-heading no-print">
        <div>
          <h2>Event Registration Report</h2>
          <p className="muted">
            Participant details and event registration summary.
          </p>
        </div>

        <div className="report-actions">
          <button
            className="secondary-button"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            Print Report
          </button>

          <Link to="/manage-events" className="secondary-button">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      <section className="panel report-header">
        <span className="event-category">Event Report</span>
        <h1>{report.event}</h1>
        <p className="muted">
          Generated on {new Date().toLocaleDateString("en-IN")}
        </p>
      </section>

      <div className="event-grid report-stats">
        <article className="panel">
          <p className="muted">Registered Participants</p>
          <h2>{report.registeredCount}</h2>
        </article>

        <article className="panel">
          <p className="muted">Maximum Capacity</p>
          <h2>{report.maximumParticipants}</h2>
        </article>

        <article className="panel">
          <p className="muted">Available Seats</p>
          <h2>{report.availableSeats}</h2>
        </article>
      </div>

      <div className="section-heading">
        <h2>Participant List</h2>
        <span className="muted">
          Total: {report.participants?.length || 0}
        </span>
      </div>

      {!report.participants?.length ? (
        <div className="empty-state">
          No participants have registered for this event.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {report.participants.map((participant, index) => (
                <tr key={participant._id}>
                  <td>{index + 1}</td>
                  <td>{participant.studentId?.name || "Unavailable"}</td>
                  <td>{participant.studentId?.email || "Unavailable"}</td>
                  <td>
                    {new Date(
                      participant.registrationDate
                    ).toLocaleDateString("en-IN")}
                  </td>
                  <td>{participant.participationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default EventReport;