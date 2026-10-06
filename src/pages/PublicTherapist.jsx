import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PublicTherapist() {
  const { slug } = useParams();

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTherapist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/therapists/public/${slug}`
        );

        setTherapist(response.data);
      } catch (err) {
        console.error(err);
        setError("Therapist profile not found");
      } finally {
        setLoading(false);
      }
    };

    loadTherapist();
  }, [slug]);

  if (loading) {
    return <div className="public-profile">Loading...</div>;
  }

  if (error) {
    return <div className="public-profile">{error}</div>;
  }

  return (
    <div className="public-profile">
      <div className="public-profile-card">
        <div className="profile-avatar">
          {therapist.name?.charAt(0).toUpperCase()}
        </div>

        <h1>{therapist.name}</h1>

        {therapist.qualification && (
          <p className="qualification">
            {therapist.qualification}
          </p>
        )}

        {therapist.experience > 0 && (
          <p>
            {therapist.experience} years of experience
          </p>
        )}

        {therapist.bio && (
          <div className="profile-section">
            <h2>About</h2>
            <p>{therapist.bio}</p>
          </div>
        )}

        {therapist.specializations?.length > 0 && (
          <div className="profile-section">
            <h2>Specializations</h2>

            <div className="tags">
              {therapist.specializations.map(
                (item, index) => (
                  <span key={index}>{item}</span>
                )
              )}
            </div>
          </div>
        )}

        {therapist.languages?.length > 0 && (
          <div className="profile-section">
            <h2>Languages</h2>
            <p>{therapist.languages.join(", ")}</p>
          </div>
        )}

        <button
          className="book-button"
          onClick={() =>
            alert("Booking will be available soon.")
          }
        >
          Book an Appointment
        </button>

        <p className="powered">
          Powered by Unfazed
        </p>
      </div>
    </div>
  );
}

export default PublicTherapist;
