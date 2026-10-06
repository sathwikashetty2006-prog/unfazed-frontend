import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    clients: 0,
    sessions: 0,
    notes: 0,
    revenue: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    let currentUser = null;

    try {
      currentUser = savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      currentUser = null;
    }

    setUser(currentUser);

    const role = currentUser?.role;

    const loadDashboard = async () => {
      try {
        if (role === "therapist") {
          const response = await api.get(
            "/analytics/dashboard"
          );

          setStats({
            clients: response.data.clients || 0,
            sessions: response.data.sessions || 0,
            notes: response.data.notes || 0,
            revenue: response.data.revenue || 0,
          });
        }

        if (role === "client") {
          const response = await api.get(
            "/client-booking/my-appointments"
          );

          setAppointments(response.data || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            YOUR WELLNESS SPACE
          </span>

          <h1>
            Welcome back
            {user?.name ? `, ${user.name}` : ""}
          </h1>

          <p>
            Here's what's happening with your
            {user?.role === "client"
              ? " appointments."
              : " practice today."}
          </p>
        </div>

        <div className="dashboard-header-actions">
          <div className="user-badge">
            <span>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>

            <div>
              <strong>{user?.name || "User"}</strong>
              <small>
                {user?.role === "therapist"
                  ? "Therapist"
                  : "Client"}
              </small>
            </div>
          </div>

          <button
            className="dashboard-logout"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>


      {/* THERAPIST DASHBOARD */}
      {user?.role === "therapist" && (
        <>
          {/* STATS */}
          <section className="dashboard-stats">

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon">♡</span>
                <span className="stat-label">
                  CLIENTS
                </span>
              </div>

              <strong>{stats.clients}</strong>

              <p>Active clients</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon">◷</span>
                <span className="stat-label">
                  SESSIONS
                </span>
              </div>

              <strong>{stats.sessions}</strong>

              <p>Total sessions</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon">✎</span>
                <span className="stat-label">
                  NOTES
                </span>
              </div>

              <strong>{stats.notes}</strong>

              <p>Session notes</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon">₹</span>
                <span className="stat-label">
                  REVENUE
                </span>
              </div>

              <strong>₹{stats.revenue}</strong>

              <p>Total revenue</p>
            </div>

          </section>


          {/* QUICK ACTIONS */}
          <section className="dashboard-section">

            <div className="section-heading">
              <div>
                <span>QUICK ACTIONS</span>
                <h2>Manage your practice</h2>
              </div>

              <p>
                Everything you need, in one place.
              </p>
            </div>


            <div className="dashboard-actions">

              <button
                onClick={() => navigate("/clients")}
                className="action-card"
              >
                <span className="action-icon">♡</span>

                <div>
                  <strong>Manage Clients</strong>
                  <p>View and manage your clients</p>
                </div>

                <span className="action-arrow">→</span>
              </button>


              <button
                onClick={() => navigate("/appointments")}
                className="action-card"
              >
                <span className="action-icon">◷</span>

                <div>
                  <strong>Appointments</strong>
                  <p>View upcoming sessions</p>
                </div>

                <span className="action-arrow">→</span>
              </button>


              <button
                onClick={() => navigate("/availability")}
                className="action-card"
              >
                <span className="action-icon">◌</span>

                <div>
                  <strong>Availability</strong>
                  <p>Set your available hours</p>
                </div>

                <span className="action-arrow">→</span>
              </button>


              <button
                onClick={() => navigate("/packages")}
                className="action-card"
              >
                <span className="action-icon">◇</span>

                <div>
                  <strong>Packages</strong>
                  <p>Manage therapy packages</p>
                </div>

                <span className="action-arrow">→</span>
              </button>


              <button
                onClick={() => navigate("/payments")}
                className="action-card"
              >
                <span className="action-icon">₹</span>

                <div>
                  <strong>Payments</strong>
                  <p>Track your payments</p>
                </div>

                <span className="action-arrow">→</span>
              </button>

            </div>

          </section>


          {/* WELLNESS MESSAGE */}
          <section className="dashboard-wellness">

            <div>
              <span>KEEP GOING</span>

              <h2>
                Supporting your clients,
                <br />
                one session at a time.
              </h2>
            </div>

            <p>
              Your work makes a difference.
              Keep creating a safe space for
              the people you support.
            </p>

          </section>
        </>
      )}


      {/* CLIENT DASHBOARD */}
      {user?.role === "client" && (
        <div className="client-dashboard">

          <div className="client-dashboard-heading">
            <div>
              <span>YOUR JOURNEY</span>
              <h2>My Appointments</h2>
            </div>
          </div>


          {appointments.length === 0 ? (
            <div className="empty-appointments">

              <div className="empty-icon">◷</div>

              <h3>No appointments yet</h3>

              <p>
                When you're ready, book a session
                with a therapist and take the next
                step in your wellness journey.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/client-booking/6ac3d5e7250069540a4794ac"
                  )
                }
              >
                Book an Appointment
                <span>→</span>
              </button>

            </div>
          ) : (
            <div className="appointments-list">

              {appointments.map((appointment) => (
                <div
                  className="appointment-card"
                  key={appointment._id}
                >

                  <div className="appointment-card-top">
                    <div>
                      <span>THERAPIST</span>

                      <h3>
                        {appointment.therapist?.name ||
                          "Therapist"}
                      </h3>
                    </div>

                    <span className="appointment-status">
                      {appointment.status}
                    </span>
                  </div>


                  <div className="appointment-details">

                    <div>
                      <span>DATE</span>

                      <strong>
                        {new Date(
                          appointment.date
                        ).toLocaleDateString()}
                      </strong>
                    </div>


                    <div>
                      <span>TIME</span>

                      <strong>
                        {new Date(
                          appointment.date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </div>


                    <div>
                      <span>DURATION</span>

                      <strong>
                        {appointment.duration} minutes
                      </strong>
                    </div>


                    <div>
                      <span>MODE</span>

                      <strong>
                        {appointment.mode}
                      </strong>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Dashboard;