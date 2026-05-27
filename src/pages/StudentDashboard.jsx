import { useState } from "react";
import {useLocation} from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const location = useLocation();
  const [studentRegNo] = useState(location.state?.studentId || "s202609874");
  const [tokens, setTokens] = useState(120); // Reward system balance
  const [activeTab, setActiveTab] = useState("overview"); // Navigation state

  // Mock State Systems
  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced Web UI Design", code: "CS-402", enrolled: true, progress: 78 },
    { id: 2, title: "Data Structures & Algorithms", code: "CS-204", enrolled: true, progress: 45 },
    { id: 3, title: "Machine Learning Foundations", code: "AI-301", enrolled: false, progress: 0 }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 101, title: "Algorithm Lab 4", course: "CS-204", tokenReward: 30, status: "Pending", file: null },
    { id: 102, title: "UI Prototype Sketching", course: "CS-402", tokenReward: 50, status: "Graded", grade: "A+ (Predefined Match)", file: "ui_v1.pdf" }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Dr. Sarah Jenkins", text: "Your assignment prototype has been successfully checked.", time: "2 hrs ago" }
  ]);

  // Handle fake file uploading
  const handleFileUpload = (id) => {
    setAssignments(prev => prev.map(asm => {
      if (asm.id === id) {
        // Mocking assignment completion and reward payout
        setTokens(t => t + asm.tokenReward);
        return { ...asm, status: "Submitted", file: "uploaded_doc.pdf" };
      }
      return asm;
    }));
  };

  // Toggle Enrollment status
  const handleEnroll = (id) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, enrolled: !c.enrolled, progress: 0 } : c));
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar Navigation */}
      <aside className="main-sidebar">
        <div className="brand-header">
          <span className="brand-logo">💎</span> Synthesis
        </div>
        <nav className="nav-menu">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>🎛️ Overview</button>
          <button className={activeTab === "courses" ? "active" : ""} onClick={() => setActiveTab("courses")}>📚 Course Studio</button>
          <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>📝 Assignments</button>
          <button className={activeTab === "rewards" ? "active" : ""} onClick={() => setActiveTab("rewards")}>🏆 Rewards Store</button>
        </nav>
        <div className="sidebar-footer">
          <span className="user-id">{studentRegNo}</span>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="main-viewport">
        <header className="dash-header">
          <h1>Student Workspace</h1>
          <div className="header-widgets">
            <div className="token-pill">✨ {tokens} Tokens</div>
            <div className="avatar">AM</div>
          </div>
        </header>

        {/* Dynamic Tab Renderer */}
        {activeTab === "overview" && (
          <div className="tab-view animate-fade">
            <section className="metrics-grid">
              <div className="metric-card">
                <label>Enrolled Programs</label>
                <h3>{courses.filter(c => c.enrolled).length} Active</h3>
              </div>
              <div className="metric-card">
                <label>Pending Assigments</label>
                <h3>{assignments.filter(a => a.status === "Pending").length} Due</h3>
              </div>
              <div className="metric-card">
                <label>Claimed Rewards</label>
                <h3>Free Books Active</h3>
              </div>
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Recent Workspace Updates</h2>
                {messages.map(msg => (
                  <div key={msg.id} className="message-node">
                    <strong>{msg.sender}</strong>
                    <p>{msg.text}</p>
                    <span className="time">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Course Enrollment Catalog</h2>
            <div className="catalog-grid">
              {courses.map(course => (
                <div key={course.id} className="catalog-card">
                  <div className="card-top">
                    <span className="code">{course.code}</span>
                    <h3>{course.title}</h3>
                  </div>
                  {course.enrolled ? (
                    <div className="enroll-status">
                      <div className="prog-track"><div className="prog-fill" style={{width: `${course.progress}%`}}></div></div>
                      <span className="percent">{course.progress}% Completed</span>
                      <button className="action-btn drop" onClick={() => handleEnroll(course.id)}>Drop</button>
                    </div>
                  ) : (
                    <button className="action-btn enroll" onClick={() => handleEnroll(course.id)}>Enroll Module</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Academic Assignments</h2>
            <div className="assignments-stack">
              {assignments.map(asm => (
                <div key={asm.id} className="assignment-strip">
                  <div className="meta">
                    <h4>{asm.title}</h4>
                    <span className="sub">{asm.course} • +{asm.tokenReward} Tokens</span>
                  </div>
                  <div className="status-zone">
                    <span className={`status-tag ${asm.status.toLowerCase()}`}>{asm.status}</span>
                    {asm.grade && <span className="grade-badge">{asm.grade}</span>}
                  </div>
                  <div className="actions">
                    {asm.status === "Pending" && (
                      <button className="upload-trigger-btn" onClick={() => handleFileUpload(asm.id)}>📁 Upload & Grade</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="tab-view animate-fade">
            <div className="store-header">
              <h2 className="pane-title">Tokens Rewards Store</h2>
              <p>Redeem your points obtained from manual uploads or programmatic grading algorithms for verified textbook keys.</p>
            </div>
            <div className="store-grid">
              <div className="store-item">
                <span className="book-cover">📘</span>
                <h4>Introduction to React v19</h4>
                <button className="redeem-btn" disabled={tokens < 80} onClick={() => setTokens(t => t - 80)}>Buy (80 Tokens)</button>
              </div>
              <div className="store-item">
                <span className="book-cover">📙</span>
                <h4>Data Structures Deep Dive</h4>
                <button className="redeem-btn" disabled={tokens < 100} onClick={() => setTokens(t => t - 100)}>Buy (100 Tokens)</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;