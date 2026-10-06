import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ClientProfile.css";

function ClientProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/clients/profile");

      const client = response.data;

      setForm({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
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
    setError("");
    setSaving(true);

    try {
      const response = await api.put(
        "/clients/profile",
        {
          name: form.name,
          phone: form.phone,
        }
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully"
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="client-profile-page">
        <div className="client-profile-loading">
          <h2>Loading profile...</h2>
          <p>
            Please wait while your profile is loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-profile-page">

      <div className="client-profile-header">
        <h1>My Profile</h1>

        <p>
          Manage your personal information and account
          details.
        </p>
      </div>

      {message && (
        <div className="client-profile-success">
          {message}
        </div>
      )}

      {error && (
        <div className="client-profile-error">
          {error}
        </div>
      )}

      <div className="client-profile-card">

        <div className="client-profile-card-heading">
          <h2>Personal Information</h2>

          <p>
            Keep your contact information up to date.
          </p>
        </div>

        <form
          className="client-profile-form"
          onSubmit={handleSubmit}
        >

          <div className="client-profile-field">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="client-profile-field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              disabled
            />

            <small>
              Email cannot be changed from your profile.
            </small>
          </div>

          <div className="client-profile-field">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          <button
            type="submit"
            className="client-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>

    </div>
  );
}

export default ClientProfile;