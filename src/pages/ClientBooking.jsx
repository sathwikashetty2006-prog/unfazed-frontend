import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ClientBooking.css";

function ClientBooking() {
  const { therapistId } = useParams();

  const [therapist, setTherapist] = useState(null);
  const [availability, setAvailability] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState("online");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const response = await api.get(
          `/client-booking/therapist/${therapistId}`
        );

        setTherapist(response.data.therapist);
        setAvailability(response.data.availability);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load therapist"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [therapistId]);

  const selectedDay =
    date ? new Date(`${date}T00:00:00`).getDay() : null;

  const availableForSelectedDay =
    availability.filter(
      (item) => item.dayOfWeek === selectedDay
    );

  const handleBooking = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!date || !time) {
      setError("Please select date and time.");
      return;
    }

    try {
      setBooking(true);

      const appointmentDate = `${date}T${time}`;

      const response = await api.post(
        "/client-booking/book",
        {
          therapist: therapistId,
          date: appointmentDate,
          duration: Number(duration),
          mode,
        }
      );

      setMessage(
        response.data.message ||
          "Appointment booked successfully"
      );

      setDate("");
      setTime("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p>Loading therapist...</p>;
  }

  if (error && !therapist) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="client-booking-page">
      <h1>Book an Appointment</h1>

      {therapist && (
        <div className="therapist-card">
          <h2>{therapist.name}</h2>

          {therapist.qualification && (
            <p>{therapist.qualification}</p>
          )}

          {therapist.experience !== undefined && (
            <p>
              Experience: {therapist.experience} years
            </p>
          )}

          {therapist.bio && (
            <p>{therapist.bio}</p>
          )}
        </div>
      )}

      <div className="availability-card">
        <h2>Weekly Availability</h2>

        {availability.length === 0 ? (
          <p>No availability added yet.</p>
        ) : (
          availability.map((slot) => (
            <p key={slot._id}>
              <strong>
                {days[slot.dayOfWeek]}
              </strong>{" "}
              {slot.startTime} - {slot.endTime}
            </p>
          ))
        )}
      </div>

      <div className="booking-card">
        <h2>Choose Appointment</h2>

        <form onSubmit={handleBooking}>
          <label>Date</label>

          <input
            type="date"
            value={date}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
              setError("");
              setMessage("");
            }}
            required
          />

          {date && (
            <p>
              Selected day:{" "}
              <strong>
                {days[selectedDay]}
              </strong>
            </p>
          )}

          {date &&
            availableForSelectedDay.length ===
              0 && (
              <p className="error-message">
                Therapist is not available on this
                day.
              </p>
            )}

          {date &&
            availableForSelectedDay.length > 0 && (
              <>
                <label>Available Hours</label>

                {availableForSelectedDay.map(
                  (slot) => (
                    <p key={slot._id}>
                      {slot.startTime} -{" "}
                      {slot.endTime}
                    </p>
                  )
                )}
              </>
            )}

          <label>Time</label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            required
          />

          <label>Duration</label>

          <select
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
          >
            <option value={30}>
              30 minutes
            </option>

            <option value={60}>
              60 minutes
            </option>

            <option value={90}>
              90 minutes
            </option>
          </select>

          <label>Mode</label>

          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value)
            }
          >
            <option value="online">
              Online
            </option>

            <option value="offline">
              Offline
            </option>
          </select>

          <button
            type="submit"
            disabled={booking}
          >
            {booking
              ? "Booking..."
              : "Book Appointment"}
          </button>
        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default ClientBooking;

