import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentRegNo] = useState(location.state?.studentId || "S202609874");
  const [tokens, setTokens] = useState(120);
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");

  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced Web UI Design", code: "CS-402", enrolled: true, progress: 78 },
    { id: 2, title: "Data Structures & Algorithms", code: "CS-204", enrolled: true, progress: 45 },
    { id: 3, title: "Machine Learning Foundations", code: "AI-301", enrolled: false, progress: 0 },
    { id: 4, title: "Database Systems", code: "CS-301", enrolled: false, progress: 0 },
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 101,
      title: "Algorithm Lab 4",
      course: "CS-204",
      tokenReward: 30,
      status: "Pending",
      file: null,
      dueDate: "2025-06-10",
      gradingType: "teacher", // graded by teacher
      grade: null,
    },
    {
      id: 102,
      title: "UI Prototype Sketching",
      course: "CS-402",
      tokenReward: 50,
      status: "Graded",
      file: "ui_v1.pdf",
      dueDate: "2025-05-28",
      gradingType: "auto", // graded by predefined answers
      grade: "A+",
    },
    {
      id: 103,
      title: "ML Concept Quiz",
      course: "AI-301",
      tokenReward: 20,
      status: "Pending",
      file: null,
      dueDate: "2025-06-15",
      gradingType: "auto",
      grade: null,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Dr. Sarah Jenkins",
      text: "Your UI prototype has been reviewed. Great work on the layout!",
      time: "2 hrs ago",
      mine: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Thank you! I will work on the feedback for the next submission.",
      time: "1 hr ago",
      mine: true,
    },
  ]);

  const [redeemed, setRedeemed] = useState([]);

  const storeItems = [
    { id: 1, title: "Introduction to React v19", cost: 80 },
    { id: 2, title: "Data Structures Deep Dive", cost: 100 },
    { id: 3, title: "Machine Learning A–Z", cost: 120 },
    { id: 4, title: "Clean Code Handbook", cost: 60 },
  ];

  const handleFileUpload = (id) => {
    setAssignments((prev) =>
      prev.map((asm) => {
        if (asm.id === id) {
          const isAuto = asm.gradingType === "auto";
          setTokens((t) => t + asm.tokenReward);
          return {
            ...asm,
            status: isAuto ? "Graded" : "Submitted",
            file: "uploaded_doc.pdf",
            grade: isAuto ? "B+" : null, // auto-graded immediately
          };
        }
        return asm;
      })
    );
  };

  const handleEnroll = (id) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, enrolled: !c.enrolled, progress: 0 } : c
      )
    );
  };

  const handleRedeem = (item) => {
    if (tokens >= item.cost && !redeemed.includes(item.id)) {
      setTokens((t) => t - item.cost);
      setRedeemed((prev) => [...prev, item.id]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        text: newMessage.trim(),
        time: "Just now",
        mine: true,
      },
    ]);
    setNewMessage("");
  };

  const pendingCount = assignments.filter((a) => a.status === "Pending").length;
  const enrolledCount = courses.filter((c) => c.enrolled).length;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="brand-header">
          <span className="brand-logo"></span> Mentora
        </div>
        <nav className="nav-menu">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}> Overview</button>
          <button className={activeTab === "courses" ? "active" : ""} onClick={() => setActiveTab("courses")}> Courses</button>
          <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
             Assignments {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </button>
          <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}> Messages</button>
          <button className={activeTab === "rewards" ? "active" : ""} onClick={() => setActiveTab("rewards")}> Rewards</button>
        </nav>
        <div className="sidebar-footer">
          <span className="user-id">{studentRegNo}</span>
          <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-viewport">
        <header className="dash-header">
          <h1>Student Workspace</h1>
          <div className="header-widgets">
            <div className="token-pill">✨ {tokens} Tokens</div>
            <div className="avatar">{studentRegNo.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="tab-view animate-fade">
            <section className="metrics-grid">
              <div className="metric-card">
                <label>Enrolled Courses</label>
                <h3>{enrolledCount} Active</h3>
              </div>
              <div className="metric-card">
                <label>Pending Assignments</label>
                <h3>{pendingCount} Due</h3>
              </div>
              <div className="metric-card">
                <label>Token Balance</label>
                <h3>✨ {tokens}</h3>
              </div>
              <div className="metric-card">
                <label>Books Redeemed</label>
                <h3>{redeemed.length} Books</h3>
              </div>
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Recent Messages</h2>
                {messages.slice(-2).map((msg) => (
                  <div key={msg.id} className="message-node">
                    <strong>{msg.sender}</strong>
                    <p>{msg.text}</p>
                    <span className="time">{msg.time}</span>
                  </div>
                ))}
                <button className="view-all-btn" onClick={() => setActiveTab("messages")}>
                  View all messages →
                </button>
              </div>

              <div className="right-pane">
                <h2 className="pane-title">Upcoming Deadlines</h2>
                {assignments
                  .filter((a) => a.status === "Pending")
                  .map((a) => (
                    <div key={a.id} className="deadline-item">
                      <span>{a.title}</span>
                      <span className="due-date">Due {a.dueDate}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Course Enrollment Catalog</h2>
            <div className="catalog-grid">
              {courses.map((course) => (
                <div key={course.id} className="catalog-card">
                  <div className="card-top">
                    <span className="code">{course.code}</span>
                    <h3>{course.title}</h3>
                  </div>
                  {course.enrolled ? (
                    <div className="enroll-status">
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="percent">{course.progress}% Completed</span>
                      <button className="action-btn drop" onClick={() => handleEnroll(course.id)}>Drop Course</button>
                    </div>
                  ) : (
                    <button className="action-btn enroll" onClick={() => handleEnroll(course.id)}>Enroll</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments */}
        {activeTab === "assignments" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Academic Assignments</h2>
            <div className="assignments-stack">
              {assignments.map((asm) => (
                <div key={asm.id} className="assignment-strip">
                  <div className="meta">
                    <h4>{asm.title}</h4>
                    <span className="sub">
                      {asm.course} • +{asm.tokenReward} Tokens •{" "}
                      {asm.gradingType === "auto" ? "⚡ Auto-graded" : "👩‍🏫 Teacher graded"}
                    </span>
                    <span className="due-label">Due: {asm.dueDate}</span>
                  </div>
                  <div className="status-zone">
                    <span className={`status-tag ${asm.status.toLowerCase()}`}>{asm.status}</span>
                    {asm.grade && <span className="grade-badge">Grade: {asm.grade}</span>}
                  </div>
                  <div className="actions">
                    {asm.status === "Pending" && (
                      <button className="upload-trigger-btn" onClick={() => handleFileUpload(asm.id)}>
                         Upload & Submit
                      </button>
                    )}
                    {asm.status === "Submitted" && (
                      <span className="waiting-label">⏳ Awaiting teacher review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {activeTab === "messages" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Messages</h2>
            <div className="chat-window">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.mine ? "mine" : "theirs"}`}>
                  {!msg.mine && <strong>{msg.sender}</strong>}
                  <p>{msg.text}</p>
                  <span className="time">{msg.time}</span>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="chat-input"
              />
              <button className="send-btn" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}

        {/* Rewards */}
        {activeTab === "rewards" && (
          <div className="tab-view animate-fade">
            <div className="store-header">
              <h2 className="pane-title">Rewards Store</h2>
              <p>Earn tokens by submitting assignments. Redeem them for free textbooks.</p>
              <div className="token-balance-card">✨ Your balance: <strong>{tokens} Tokens</strong></div>
            </div>
            <div className="store-grid">
              {storeItems.map((item) => {
                const owned = redeemed.includes(item.id);
                return (
                  <div key={item.id} className={`store-item ${owned ? "owned" : ""}`}>
                    <span className="book-cover">{item.emoji}</span>
                    <h4>{item.title}</h4>
                    <span className="item-cost">{item.cost} Tokens</span>
                    <button
                      className="redeem-btn"
                      disabled={tokens < item.cost || owned}
                      onClick={() => handleRedeem(item)}
                    >
                      {owned ? " Redeemed" : tokens < item.cost ? "Not enough tokens" : "Redeem Free"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;