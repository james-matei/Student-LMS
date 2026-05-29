import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [regNO, setRegNO] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check empty fields
    if (!name || !regNO || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!regNO.trim().toLowerCase().startsWith("s")) {
    setError("Registration Number must begin with 's' (e.g., s202609874).");
    return;
  }

   
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.");
      return;
    }

    setError("");
    console.log({ name, regNO, email, password });
    
    // Simulate successful registration
    navigate("/");
  };

  return (
    <div className="register-page-container">
      <div className="register-dashboard-grid">
        
        {/* Left Side branding panel matching the main system theme */}
        <div className="register-hero-section">
          <span className="system-tag">Secure Onboarding Portal</span>
          <h1 className="register-hero-title">Join our digital ecosystem.</h1>
          <p className="register-hero-subtitle">
            Create an institutional profile to begin tracking adaptive training data, 
            accessing specialized materials, and customizing your workspace environment.
          </p>
        </div>

        {/* Right Side Glass Card Form */}
        <div className="glass-register-card">
          <div className="card-header-meta">
            <h2 className="register-box-title">Create Account</h2>
            <p className="register-box-subtitle">Fill in your registration data details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            
            <div className="input-field-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label>Registration Number</label>
              <input
                type="text"
                placeholder="Registration Number"
                value={regNO}
                onChange={(e) => setRegNO(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label>Password</label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-register-btn">Register</button>
          </form>

          <div className="card-footer">
            Already have an account? 
            <Link to="/" className="login-link">Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;