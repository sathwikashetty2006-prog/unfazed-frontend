import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isClient = user?.role === "client";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Unfazed</h1>
        <p>{isClient ? "Client Portal" : "Therapy Management"}</p>
      </div>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/profile">My Profile</NavLink>

        {isClient ? (
          <>
            <NavLink to="/client-booking">
  Book Appointment
</NavLink>

            <NavLink to="/client-appointments">
              My Appointments
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/clients">Clients</NavLink>

            <NavLink to="/appointments">
              Appointments
            </NavLink>

            <NavLink to="/notes">
              Session Notes
            </NavLink>

            <NavLink to="/packages">
              Packages
            </NavLink>

            <NavLink to="/payments">
              Payments
            </NavLink>

            <NavLink to="/availability">
              Availability
            </NavLink>
          </>
        )}
      </nav>

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;