import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

function Home() {
  return (
    <>
      <section className="welcome-section">
        <h1>Discover What's Happening on Campus</h1>
        <p>
          Explore college events, workshops, competitions and activities.
          Find opportunities to learn, participate and connect.
        </p>

        <Link to="/events" className="primary-button">
          Explore Events <ArrowRight size={17} />
        </Link>
      </section>

      <main className="page-container">
        <div className="section-heading">
          <div>
            <h2>Everything Happening in One Place</h2>
            <p className="muted">
              A simple platform for students to discover and register for events.
            </p>
          </div>
        </div>

        <div className="event-grid">
          <article className="panel">
            <CalendarDays color="#4f46e5" size={28} />
            <h3>Explore Events</h3>
            <p className="muted">
              Browse upcoming technical, cultural and academic events.
            </p>
          </article>

          <article className="panel">
            <CalendarDays color="#4f46e5" size={28} />
            <h3>Easy Registration</h3>
            <p className="muted">
              Register for events and keep track of your participation.
            </p>
          </article>

          <article className="panel">
            <CalendarDays color="#4f46e5" size={28} />
            <h3>Student Dashboard</h3>
            <p className="muted">
              View your registrations and manage your event participation.
            </p>
          </article>
        </div>

        <div className="section-heading">
          <h2>Ready to participate?</h2>
          <Link to="/events" className="primary-button">
            View Events
          </Link>
        </div>
      </main>

      <footer className="footer">
        CampusConnect — College Event Registration Portal
      </footer>
    </>
  );
}

export default Home;