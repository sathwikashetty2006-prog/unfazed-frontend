import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Background */}
      <div className="home-background"></div>

      {/* Soft overlay */}
      <div className="home-overlay"></div>

      {/* Decorative curves */}
      <div className="curve curve-top"></div>
      <div className="curve curve-bottom"></div>

      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-logo">
          <span className="logo-mark">U</span>
          <span>Unfazed</span>
        </div>

        <div className="home-nav-links">
          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="nav-register"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="home-content">

        <div className="home-text">

          <p className="home-label">
            YOUR WELLNESS JOURNEY
          </p>

          <h1>
            You don't have to
            <br />
            <span>face it alone.</span>
          </h1>

          <p className="home-description">
            Professional mental health support,
            <br />
            whenever you need it.
          </p>

          <div className="home-buttons">

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
              I already have an account
            </button>

          </div>

          <div className="home-features">
            <span>✓ Confidential</span>
            <span>✓ Professional support</span>
            <span>✓ Your privacy matters</span>
          </div>

        </div>

      </main>

      {/* Bottom text */}
      <div className="home-bottom">
        <span>UNFAZED</span>
        <span>MENTAL WELLNESS PLATFORM</span>
      </div>

    </div>
  );
}

export default Home;