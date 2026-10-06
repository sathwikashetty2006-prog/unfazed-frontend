import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ClientAppointments.css";

function ClientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/client-booking/my-appointments");

      setAppointments(response.data || []);
    } catch (err) {
      console.error("Failed to load appointments:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const now = new Date();

  /*
    Separate upcoming and past appointments.
    Upcoming = current/future appointments
    Past = appointments whose date has already passed.
  */
  const upcomingAppointments = appointments
    .filter((appointment) => {
      return new Date(appointment.date) >= now;
    })
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

  const pastAppointments = appointments
    .filter((appointment) => {
      return new Date(appointment.date) < now;
    })
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMode = (mode) => {
    if (!mode) return "Online";

    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  const getStatusClass = (status) => {
    if (!status) return "scheduled";

    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const renderAppointment = (appointment, isPast = false) => {
    return (
      <div
        className={`client-appointment-card ${
          isPast ? "past-appointment" : ""
        }`}
        key={appointment._id}
      >
        <div className="client-appointment-top">
          <div className="therapist-info">
            <div className="therapist-avatar">
              {appointment.therapist?.name
                ?.charAt(0)
                .toUpperCase() || "T"}
            </div>

            <div>
              <h3>
                {appointment.therapist?.name ||
                  "Therapist"}
              </h3>

              {appointment.therapist?.qualification && (
                <p>
                  {appointment.therapist.qualification}
                </p>
              )}
            </div>
          </div>

          <span
            className={`appointment-status ${getStatusClass(
              appointment.status
            )}`}
          >
            {appointment.status || "Scheduled"}
          </span>
        </div>

        <div className="client-appointment-details">
          <div className="appointment-detail">
            <span className="detail-label">DATE</span>
            <strong>
              {formatDate(appointment.date)}
            </strong>
          </div>

          <div className="appointment-detail">
            <span className="detail-label">TIME</span>
            <strong>
              {formatTime(appointment.date)}
            </strong>
          </div>

          <div className="appointment-detail">
            <span className="detail-label">DURATION</span>
            <strong>
              {appointment.duration || 60} minutes
            </strong>
          </div>

          <div className="appointment-detail">
            <span className="detail-label">MODE</span>
            <strong>
              {formatMode(appointment.mode)}
            </strong>
          </div>
        </div>

        {appointment.mode === "online" && !isPast && (
          <div className="appointment-online-note">
            <span className="online-dot"></span>
            Online therapy session
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="client-appointments-page">
        <div className="client-appointments-loading">
          <div className="appointments-loading-circle"></div>

          <h2>Loading your appointments...</h2>

          <p>
            Please wait while we retrieve your
            appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-appointments-page">
      {/* HEADER */}
      <div className="client-appointments-header">
        <div>
          <span className="client-appointments-label">
            YOUR THERAPY JOURNEY
          </span>

          <h1>My Appointments</h1>

          <p>
            View your upcoming and previous therapy
            sessions.
          </p>
        </div>

        <button
          type="button"
          className="appointments-refresh-button"
          onClick={loadAppointments}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="client-appointments-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadAppointments}
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO APPOINTMENTS */}
      {!error &&
        appointments.length === 0 && (
          <div className="client-appointments-empty">
            <div className="empty-icon">◷</div>

            <h2>No appointments yet</h2>

            <p>
              You haven't booked any therapy sessions
              yet.
            </p>
          </div>
        )}

      {/* UPCOMING */}
      {!error &&
        upcomingAppointments.length > 0 && (
          <section className="appointments-section">
            <div className="appointments-section-header">
              <div>
                <span className="section-label">
                  NEXT SESSIONS
                </span>

                <h2>Upcoming Appointments</h2>
              </div>

              <span className="appointment-count">
                {upcomingAppointments.length}
              </span>
            </div>

            <div className="appointments-list">
              {upcomingAppointments.map(
                (appointment) =>
                  renderAppointment(
                    appointment,
                    false
                  )
              )}
            </div>
          </section>
        )}

      {/* PAST */}
      {!error &&
        pastAppointments.length > 0 && (
          <section className="appointments-section past-section">
            <div className="appointments-section-header">
              <div>
                <span className="section-label">
                  YOUR HISTORY
                </span>

                <h2>Previous Appointments</h2>
              </div>

              <span className="appointment-count">
                {pastAppointments.length}
              </span>
            </div>

            <div className="appointments-list">
              {pastAppointments.map(
                (appointment) =>
                  renderAppointment(
                    appointment,
                    true
                  )
              )}
            </div>
          </section>
        )}

      {/* ONLY PAST APPOINTMENTS */}
      {!error &&
        appointments.length > 0 &&
        upcomingAppointments.length === 0 &&
        pastAppointments.length > 0 && (
          <div className="appointments-info">
            <p>
              You don't have any upcoming appointments.
              Book a new session whenever you're ready.
            </p>
          </div>
        )}
    </div>
  );
}

export default ClientAppointments;