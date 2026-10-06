import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Clients.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  };

  useEffect(() => {
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
      await api.post("/clients", form);

      setMessage("Client added successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
      });

      loadClients();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add client"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clients-page">

      {/* PAGE HEADER */}
      <div className="clients-header">
        <div>
          <span>CLIENT MANAGEMENT</span>
          <h1>Your Clients</h1>
          <p>
            Manage the people you support and keep
            their information organized.
          </p>
        </div>

        <div className="client-count">
          <strong>{clients.length}</strong>
          <span>
            {clients.length === 1
              ? "Client"
              : "Clients"}
          </span>
        </div>
      </div>


      {/* ADD CLIENT */}
      <section className="add-client-card">

        <div className="add-client-heading">
          <div className="add-client-icon">+</div>

          <div>
            <h2>Add New Client</h2>
            <p>
              Add a client to your practice.
            </p>
          </div>
        </div>

        <form
          className="client-form"
          onSubmit={handleSubmit}
        >

          <div className="client-input">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter client name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="client-input">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>


          <div className="client-input">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>


          <button
            type="submit"
            className="add-client-button"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Client"}

            {!loading && <span>→</span>}
          </button>

        </form>

        {message && (
          <p
            className={
              message.includes("successfully")
                ? "client-success"
                : "client-error"
            }
          >
            {message}
          </p>
        )}

      </section>


      {/* CLIENT LIST */}
      <section className="clients-list-section">

        <div className="clients-list-heading">
          <div>
            <span>YOUR PRACTICE</span>
            <h2>All Clients</h2>
          </div>

          <p>
            {clients.length}{" "}
            {clients.length === 1
              ? "client"
              : "clients"}
          </p>
        </div>


        {clients.length === 0 ? (

          <div className="no-clients">

            <div className="no-clients-icon">
              ♡
            </div>

            <h3>No clients yet</h3>

            <p>
              Add your first client using the form
              above to get started.
            </p>

          </div>

        ) : (

          <div className="clients-grid">

            {clients.map((client) => (

              <div
                className="client-card"
                key={client._id}
              >

                <div className="client-card-top">

                  <div className="client-avatar">
                    {client.name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div className="client-name">
                    <h3>{client.name}</h3>
                    <span>Client</span>
                  </div>

                </div>


                <div className="client-details">

                  <div className="client-detail">
                    <span>EMAIL</span>
                    <p>{client.email}</p>
                  </div>


                  <div className="client-detail">
                    <span>PHONE</span>
                    <p>
                      {client.phone ||
                        "No phone number"}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Clients;