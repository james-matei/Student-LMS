import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Switched to Link to match React Router patterns
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    // 💡 FIX: Create the missing variable from the entered username
    const standardInput = username.trim().toLowerCase();

    // 🔄 Route based on prefix check
    if (standardInput.startsWith("s")) {
  navigate("/student", { state: { studentId: username.trim() } });
} else if (standardInput.startsWith("t")) {
  navigate("/teacher", { state: { teacherId: username.trim() } });
} else if (standardInput.startsWith("a")) {
  navigate("/admin", { state: { adminId: username.trim() } });
} else {
  setError("Unrecognised prefix. Use S, T, or A.");
}
  };

  return (
    <div className="page-container">
      <div className="dashboard-grid">
    
        {/* Left/Center Header Content */}
        <div className="hero-section">
          <span className="system-tag">Online Learning Management System</span>
          <h1 className="hero-title">Learn anywhere,<br />teach everywhere.</h1>
          <p className="hero-subtitle">
            An intelligent, adaptive platform connecting global institutions, educators, 
            and creators — leveraging AI to personalize every learning journey and 
            streamline administrative tasks. Embrace the future of dynamic education.
          </p>
          <div className="roles-container">
            <div className="role-card">
              <p>Teachers create and publish adaptive content</p>
            </div>
            <div className="role-card">
              <p>Students engage with personalized lesson paths</p>
            </div>
            <div className="role-card">
              <p>Admins foster institutional collaboration and security</p>
            </div>
          </div>
        </div>

        {/* Glass Login form panel layout */}
        <div className="glass-login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-field-group">
              <label>Username / Registration Number</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="s202609874"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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

            <button type="submit" className="submit-signin-btn">Sign in</button>
          </form>
          
          <div className="card-footer">
            No account? <Link to="/register" className="register-link">Register</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;