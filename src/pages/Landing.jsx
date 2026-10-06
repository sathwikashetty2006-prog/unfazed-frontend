import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <header className="landing-header">

        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          UNFAZED
        </div>

        <div className="header-actions">

          <button
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="header-button"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            Mental wellness, made simple
          </span>

          <h1>
            A calmer mind
            <br />
            starts with <span>Unfazed.</span>
          </h1>

          <p>
            Connect with trusted therapists, book sessions,
            and take the next step toward better mental
            wellbeing — privately and comfortably.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={() => navigate("/register")}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/login")}
            >
              Therapist Login
            </button>

          </div>

        </div>


        {/* ================= WELLNESS CARD ================= */}

        <div className="wellness-card">

          <div className="wellness-top">

            <span>
              YOUR WELLNESS JOURNEY
            </span>

            <span className="status-dot"></span>

          </div>

          <h2>
            You don't have to
            <br />
            face it alone.
          </h2>

          <p>
            Professional support when you need it,
            in a safe and confidential environment.
          </p>

          <div className="card-divider"></div>

          <div className="wellness-details">

            <div>
              <strong>Private</strong>
              <span>Confidential care</span>
            </div>

            <div>
              <strong>Flexible</strong>
              <span>Book when ready</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="feature">

          <div className="feature-icon">
            ♡
          </div>

          <div>

            <h3>
              Confidential
            </h3>

            <p>
              Your conversations and personal
              information are treated with care
              and privacy.
            </p>

          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            ◷
          </div>

          <div>

            <h3>
              Flexible Sessions
            </h3>

            <p>
              Choose a convenient date and time
              that works for your schedule.
            </p>

          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            +
          </div>

          <div>

            <h3>
              Professional Care
            </h3>

            <p>
              Connect with therapists and find
              support for your mental wellness.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="bottom-cta">

        <div>

          <span>
            TAKE THE NEXT STEP
          </span>

          <h2>
            Ready to feel a little
            <br />
            more like yourself?
          </h2>

        </div>

        <div className="cta-message">
          Start your wellness journey today.
        </div>

        <button
          onClick={() => navigate("/register")}
        >
          Get Started
          <span>→</span>
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">

        <div className="footer-logo">
          UNFAZED
        </div>

        <p>
          Mental wellness, made simple.
        </p>

        <div className="footer-links">

          <button
            onClick={() => navigate("/login")}
          >
            Therapist Login
          </button>

          <span></span>

          <button
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;