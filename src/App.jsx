import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Clients from "./pages/Clients.jsx";
import Appointments from "./pages/Appointments.jsx";
import Notes from "./pages/Notes.jsx";
import Packages from "./pages/Packages.jsx";
import Payments from "./pages/Payments.jsx";
import Availability from "./pages/Availability.jsx";
import ClientBooking from "./pages/ClientBooking.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import TherapistProfile from "./pages/TherapistProfile.jsx";
import PublicTherapist from "./pages/PublicTherapist.jsx";
import ClientAppointments from "./pages/ClientAppointments.jsx";
import TherapistList from "./pages/TherapistList.jsx";

// Components
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LANDING PAGE
        ========================= */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* =========================
            AUTH
        ========================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            DASHBOARD
        ========================= */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* =========================
            CLIENTS
        ========================= */}
        <Route
          path="/clients"
          element={
            <Layout>
              <Clients />
            </Layout>
          }
        />

        {/* =========================
            APPOINTMENTS
        ========================= */}
        <Route
          path="/appointments"
          element={
            <Layout>
              <Appointments />
            </Layout>
          }
        />

        {/* =========================
            SESSION NOTES
        ========================= */}
        <Route
          path="/notes"
          element={
            <Layout>
              <Notes />
            </Layout>
          }
        />

        {/* =========================
            PACKAGES
        ========================= */}
        <Route
          path="/packages"
          element={
            <Layout>
              <Packages />
            </Layout>
          }
        />

        {/* =========================
            PAYMENTS
        ========================= */}
        <Route
          path="/payments"
          element={
            <Layout>
              <Payments />
            </Layout>
          }
        />

        {/* =========================
            AVAILABILITY
        ========================= */}
        <Route
          path="/availability"
          element={
            <Layout>
              <Availability />
            </Layout>
          }
        />

        {/* =========================
            PROFILE
        ========================= */}
        <Route
  path="/profile"
  element={
    JSON.parse(localStorage.getItem("user"))?.role === "client" ? (
      <Layout>
        <ClientProfile />
      </Layout>
    ) : (
      <Layout>
        <TherapistProfile />
      </Layout>
    )
  }
/>

        {/* =========================
            PUBLIC THERAPIST PROFILE
        ========================= */}
        <Route
          path="/therapist/:slug"
          element={<PublicTherapist />}
        />

        {/* =========================
            CLIENT BOOKING
        ========================= */}
        <Route
          path="/client-booking/:therapistId"
          element={<ClientBooking />}
        />

        {/* =========================
            UNKNOWN URL
        ========================= */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
        <Route
  path="/client-appointments"
  element={<ClientAppointments />}
/>
<Route
  path="/client-booking"
  element={
    <Layout>
      <TherapistList />
    </Layout>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;