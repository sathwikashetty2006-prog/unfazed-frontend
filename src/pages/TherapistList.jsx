import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/TherapistList.css";

function TherapistList() {
  const navigate = useNavigate();

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/therapists");

      setTherapists(response.data);
    } catch (err) {
      console.error("Failed to load therapists:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load therapists"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTherapist = (therapist) => {
    navigate(`/client-booking/${therapist._id}`);
  };

  if (loading) {
    return (
      <div className="therapist-list-page">
        <div className="therapist-list-loading">
          <div className="loading-circle"></div>
          <h2>Finding therapists...</h2>
          <p>Please wait while we load available therapists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-list-page">
      <div className="therapist-list-header">
        <span className="therapist-list-label">
          FIND YOUR THERAPIST
        </span>

        <h1>Choose a therapist who feels right for you.</h1>

        <p>
          Browse our therapists and choose someone based on
          their experience, qualifications, and areas of
          specialization.
        </p>
      </div>

      {error && (
        <div className="therapist-list-error">
          <p>{error}</p>

          <button onClick={loadTherapists}>
            Try Again
          </button>
        </div>
      )}

      {!error && therapists.length === 0 && (
        <div className="therapist-list-empty">
          <h2>No therapists available</h2>
          <p>
            There are currently no active therapists available
            for booking.
          </p>
        </div>
      )}

      {!error && therapists.length > 0 && (
        <div className="therapist-grid">
          {therapists.map((therapist) => (
            <div
              className="therapist-card"
              key={therapist._id}
            >
              <div className="therapist-card-top">
                <div className="therapist-avatar">
                  {therapist.name
                    ?.charAt(0)
                    .toUpperCase() || "T"}
                </div>

                <span className="therapist-active">
                  Available
                </span>
              </div>

              <div className="therapist-card-content">
                <h2>
                  {therapist.name || "Therapist"}
                </h2>

                {therapist.qualification && (
                  <p className="therapist-qualification">
                    {therapist.qualification}
                  </p>
                )}

                {therapist.experience !== undefined && (
                  <p className="therapist-experience">
                    {therapist.experience}{" "}
                    {therapist.experience === 1
                      ? "year"
                      : "years"}{" "}
                    of experience
                  </p>
                )}

                {therapist.bio && (
                  <p className="therapist-bio">
                    {therapist.bio.length > 140
                      ? `${therapist.bio.substring(0, 140)}...`
                      : therapist.bio}
                  </p>
                )}

                {therapist.specializations?.length > 0 && (
                  <div className="therapist-specializations">
                    {therapist.specializations
                      .slice(0, 4)
                      .map((item, index) => (
                        <span key={index}>
                          {item}
                        </span>
                      ))}
                  </div>
                )}

                <button
                  className="choose-therapist-button"
                  onClick={() =>
                    handleSelectTherapist(therapist)
                  }
                >
                  View Availability
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TherapistList;