import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Availability.css";

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function Availability() {
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  const [availability, setAvailability] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAvailability = async () => {
    try {
      const response = await api.get("/availability");
      setAvailability(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load availability"
      );
    }
  };

  useEffect(() => {
    loadAvailability();
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
    setError("");

    try {
      const response = await api.post(
        "/availability",
        {
          dayOfWeek: Number(form.dayOfWeek),
          startTime: form.startTime,
          endTime: form.endTime,
        }
      );

      setMessage(response.data.message);

      await loadAvailability();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create availability"
      );
    }
  };

  const deleteAvailability = async (id) => {
    try {
      await api.delete(`/availability/${id}`);

      setMessage("Availability deleted successfully");

      await loadAvailability();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete availability"
      );
    }
  };

  const getDayName = (dayNumber) => {
    return (
      days.find(
        (day) => day.value === dayNumber
      )?.label || "Unknown"
    );
  };

  return (
    <div className="availability-page">
      <div className="availability-header">
        <h1>Availability</h1>

        <p>
          Set the days and hours when clients can book
          appointments.
        </p>
      </div>

      {message && (
        <p className="availability-success">
          {message}
        </p>
      )}

      {error && (
        <p className="availability-error">
          {error}
        </p>
      )}

      <div className="availability-form-card">
        <h2>Set Your Availability</h2>

        <form onSubmit={handleSubmit}>
          <div className="availability-field">
            <label>Day</label>

            <select
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={handleChange}
            >
              {days.map((day) => (
                <option
                  key={day.value}
                  value={day.value}
                >
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="availability-field">
            <label>Start Time</label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="availability-field">
            <label>End Time</label>

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="availability-add-button"
          >
            Add Availability
          </button>
        </form>
      </div>

      <div className="weekly-availability">
        <h2>My Weekly Availability</h2>

        {availability.length === 0 ? (
          <div className="availability-empty">
            <p>No availability added yet.</p>
          </div>
        ) : (
          <div className="availability-list">
            {availability.map((item) => (
              <div
                key={item._id}
                className="availability-item"
              >
                <div className="availability-day">
                  <strong>
                    {getDayName(item.dayOfWeek)}
                  </strong>

                  <span>
                    {item.startTime} - {item.endTime}
                  </span>
                </div>

                <button
                  type="button"
                  className="availability-delete"
                  onClick={() =>
                    deleteAvailability(item._id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Availability;