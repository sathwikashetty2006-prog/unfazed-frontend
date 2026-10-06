import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/TherapistProfile.css";

function TherapistProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    qualification: "",
    experience: "",
    bio: "",
    specializations: "",
    languages: "",
  });

  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/therapists/profile");

      const therapist = response.data;

      setForm({
        name: therapist.name || "",
        phone: therapist.phone || "",
        qualification: therapist.qualification || "",
        experience: therapist.experience || "",
        bio: therapist.bio || "",
        specializations:
          therapist.specializations?.join(", ") || "",
        languages:
          therapist.languages?.join(", ") || "",
      });

      setSlug(therapist.slug || "");
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
        "/therapists/profile",
        {
          name: form.name,
          phone: form.phone,
          qualification: form.qualification,
          experience: Number(form.experience) || 0,
          bio: form.bio,

          specializations: form.specializations
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          languages: form.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully"
      );

      setSlug(
        response.data.therapist?.slug || ""
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
      <div className="therapist-profile-page">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
          <p>Please wait while your profile is loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-profile-page">

      <div className="therapist-profile-header">
        <div>
          <h1>Therapist Profile</h1>

          <p>
            Manage your professional information and
            public profile.
          </p>
        </div>
      </div>

      {message && (
        <div className="profile-success">
          {message}
        </div>
      )}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      <div className="profile-card">

        <div className="profile-card-heading">
          <h2>Professional Information</h2>

          <p>
            Keep your information updated so clients
            know more about you.
          </p>
        </div>

        <form
          className="therapist-profile-form"
          onSubmit={handleSubmit}
        >

          <div className="profile-form-grid">

            <div className="profile-form-group">
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

            <div className="profile-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="profile-form-group">
              <label>Qualification</label>

              <input
                type="text"
                name="qualification"
                placeholder="Example: MSc Clinical Psychology"
                value={form.qualification}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-group">
              <label>Experience (Years)</label>

              <input
                type="number"
                min="0"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Years of experience"
              />
            </div>

          </div>

          <div className="profile-form-group">
            <label>Specializations</label>

            <input
              type="text"
              name="specializations"
              placeholder="Anxiety, Depression, Stress"
              value={form.specializations}
              onChange={handleChange}
            />

            <small>
              Separate multiple specializations with
              commas.
            </small>
          </div>

          <div className="profile-form-group">
            <label>Languages</label>

            <input
              type="text"
              name="languages"
              placeholder="English, Kannada, Hindi"
              value={form.languages}
              onChange={handleChange}
            />

            <small>
              Separate multiple languages with commas.
            </small>
          </div>

          <div className="profile-form-group">
            <label>Professional Bio</label>

            <textarea
              name="bio"
              rows="6"
              placeholder="Tell clients about yourself..."
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>

      {slug && (
        <div className="public-profile-box">

          <div>
            <h2>Your Public Profile</h2>

            <p>
              Your profile is available using the
              following slug:
            </p>

            <strong>{slug}</strong>
          </div>

          <div className="public-profile-api">
            <p>Public profile API:</p>

            <code>
              http://localhost:5000/api/therapists/public/{slug}
            </code>
          </div>

        </div>
      )}

    </div>
  );
}

export default TherapistProfile;