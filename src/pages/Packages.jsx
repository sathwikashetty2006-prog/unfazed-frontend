import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Packages.css";

function Packages() {
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    sessions: "3",
    price: "",
    expiryDays: "30",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await api.get("/packages");
      setPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/packages", {
        ...form,
        sessions: Number(form.sessions),
        price: Number(form.price),
        expiryDays: Number(form.expiryDays),
      });

      setMessage("Package created successfully!");

      setForm({
        name: "",
        sessions: "3",
        price: "",
        expiryDays: "30",
      });

      loadPackages();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create package"
      );
    }
  };

  return (
    <div className="packages-page">
      <h1>Packages</h1>
      <p>Create therapy packages for your clients.</p>

      <div className="client-form">
        <h2>Create Package</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Package Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            name="sessions"
            value={form.sessions}
            onChange={handleChange}
          >
            <option value="3">3 Sessions</option>
            <option value="6">6 Sessions</option>
            <option value="12">12 Sessions</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="number"
            name="expiryDays"
            placeholder="Expiry Days"
            value={form.expiryDays}
            onChange={handleChange}
            min="1"
            required
          />

          <button type="submit">
            Create Package
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>

      <div className="client-list">
        <h2>My Packages</h2>

        {packages.length === 0 ? (
          <p>No packages created yet.</p>
        ) : (
          packages.map((pkg) => (
            <div className="client-card" key={pkg._id}>
              <h3>{pkg.name}</h3>

              <p>
                Sessions: {pkg.sessions}
              </p>

              <p>
                Price: ₹{pkg.price}
              </p>

              <p>
              Per Session: ₹{Number(pkg.perSessionRate).toFixed(2)}
             </p>

              <p>
                Valid for: {pkg.expiryDays} days
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Packages;
