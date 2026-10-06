import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);

  const [form, setForm] = useState({
    client: "",
    date: "",
    time: "",
    duration: 60,
    type: "Online",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    try {
      const response = await api.get("/scheduling");
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data || []);
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadClients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
  await api.post("/scheduling", {
    client: form.client,
    date: form.date,
    time: form.time,
    duration: Number(form.duration),
    mode: form.type.toLowerCase(),
    notes: form.notes,
  });

      setMessage("Appointment booked successfully!");

      setForm({
        client: "",
        date: "",
        time: "",
        duration: 60,
        type: "Online",
        notes: "",
      });

      await loadAppointments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="appointments-page">

      <div className="appointments-header">
        <div>
          <span>THERAPY SCHEDULE</span>
          <h1>Appointments</h1>
          <p>
            Schedule and manage your upcoming therapy sessions.
          </p>
        </div>

        <div className="appointment-count">
          <strong>{appointments.length}</strong>
          <span>Appointments</span>
        </div>
      </div>

      <div className="appointment-form-card">

        <div className="appointment-form-heading">
          <div className="appointment-form-icon">+</div>

          <div>
            <h2>Book New Appointment</h2>
            <p>
              Create a session with one of your clients.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="appointment-form-grid">

            <div className="appointment-field">
              <label>Client</label>

              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Client
                </option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-field">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="appointment-field">
              <label>Time</label>

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="appointment-field">
              <label>Duration</label>

              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            <div className="appointment-field">
              <label>Session Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </select>
            </div>

            <div className="appointment-field appointment-notes">
              <label>Notes</label>

              <input
                type="text"
                name="notes"
                placeholder="Optional session notes"
                value={form.notes}
                onChange={handleChange}
              />
            </div>

          </div>

          <button
            type="submit"
            className="book-appointment-button"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Book Appointment"}
          </button>

        </form>

        {message && (
          <p className="appointment-message">
            {message}
          </p>
        )}
      </div>

      <div className="appointments-list-section">

        <div className="appointments-list-heading">
          <div>
            <span>UPCOMING & RECENT</span>
            <h2>Your Appointments</h2>
          </div>

          <p>
            {appointments.length} total
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appointments-icon">
              ◷
            </div>

            <h3>No appointments yet</h3>

            <p>
              Once you book a session, your appointments
              will appear here.
            </p>
          </div>
        ) : (
          <div className="appointments-grid">

            {appointments.map((appointment) => (
              <div
                className="appointment-card"
                key={appointment._id}
              >

                <div className="appointment-card-top">

                  <div className="appointment-date">
  <strong>
    {formatDate(appointment.date)}
  </strong>

  <span>
    {appointment.date
      ? new Date(appointment.date).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Time not set"}
  </span>
</div>


                  <span className="appointment-status">
                    {appointment.status || "Scheduled"}
                  </span>

                </div>

                <div className="appointment-card-details">

                  <div>
                    <span>CLIENT</span>

                    <p>
                      {appointment.client?.name ||
                        appointment.clientName ||
                        "Client"}
                    </p>
                  </div>

                  <div>
                    <span>TYPE</span>

                    <p>
                      {appointment.type ||
                        "Online"}
                    </p>
                  </div>

                  <div>
                    <span>DURATION</span>

                    <p>
                      {appointment.duration ||
                        60} minutes
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Appointments;