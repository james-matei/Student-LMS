import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLessonsByCourse } from "../services/lessonService";
import { getAllCourses } from "../services/courseService";
import { enrollInCourse, unenrollFromCourse, getMyEnrollments } from "../services/enrollmentService";
import { getAssignmentsByCourse } from "../services/assignmentService";
import { submitAssignment, getMySubmissions } from "../services/submissionService";
import { addTokens, spendTokens, getTokenBalance } from "../services/userService";
import "../styles/StudentDashboard.css";
import "../styles/Dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [studentRegNo] = useState(storedUser.regNO || "Unknown");
  const [studentDbId] = useState(storedUser.id || null);
  const [tokens, setTokens] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    if (studentDbId) fetchTokenBalance();
}, [studentDbId]);

const fetchTokenBalance = async () => {
    try {
        const response = await getTokenBalance(studentDbId);
        setTokens(response.data);
    } catch (error) {
        console.error("Failed to load tokens:", error);
    }
};

  // ─── Courses ───────────────────────────────────────────
  const [courses, setCourses] = useState([]);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data.filter((c) => c.published));
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  // ─── Enrollments ───────────────────────────────────────
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (studentDbId) fetchEnrollments();
  }, [studentDbId]);

  const fetchEnrollments = async () => {
    try {
      const response = await getMyEnrollments(studentDbId);
      setEnrollments(response.data);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  };

  const handleEnroll = async (course) => {
    const isEnrolled = enrollments.some((e) => e.course.id === course.id);
    try {
      if (isEnrolled) {
        await unenrollFromCourse(studentDbId, course.id);
      } else {
        await enrollInCourse(studentDbId, course.id);
      }
      await fetchEnrollments();
      await fetchCourses();
    } catch (error) {
      console.error("Enrollment error:", error.response?.data);
    }
  };

  // ─── Lessons ───────────────────────────────────────────
  const [lessons, setLessons] = useState([]);
  const [selectedLessonCourseId, setSelectedLessonCourseId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null); // for video player

  useEffect(() => {
    if (selectedLessonCourseId) fetchLessons(selectedLessonCourseId);
  }, [selectedLessonCourseId]);

  const fetchLessons = async (courseId) => {
    try {
      const response = await getLessonsByCourse(courseId);
      setLessons(response.data);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    }
  };

  // ─── Assignments ───────────────────────────────────────
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]); // { assignmentId: submission }
  const [selectedAssignmentCourseId, setSelectedAssignmentCourseId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // which assignment is being uploaded
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (studentDbId) fetchMySubmissions();
  }, [studentDbId]);

  useEffect(() => {
    if (selectedAssignmentCourseId) fetchAssignments(selectedAssignmentCourseId);
  }, [selectedAssignmentCourseId]);

  const fetchAssignments = async (courseId) => {
    try {
       console.log("Fetching assignments for courseId:", courseId);
      const response = await getAssignmentsByCourse(courseId);
      console.log("Assignments received:", response.data);
      setAssignments(response.data);
    } catch (error) {
      console.error("Failed to load assignments:", error);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const response = await getMySubmissions(studentDbId);
      setMySubmissions(response.data);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const handleSubmit = async (assignmentId) => {
    if (!uploadFile) return;
    try {
      await submitAssignment(studentDbId, assignmentId, uploadFile);
      // add token reward
     
      setUploadFile(null);
      setUploadingId(null);
      await fetchMySubmissions();
      await fetchTokenBalance();
    } catch (error) {
      console.error("Submission failed:", error.response?.data);
      console.error("Submission status:", error.response?.status);
        console.error("Submission message:", error.message); 
    }
  };

  const getSubmissionForAssignment = (assignmentId) =>
    mySubmissions.find((s) => s.assignment?.id === assignmentId);

  // ─── Messages ──────────────────────────────────────────
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dr. Sarah Jenkins", text: "Your UI prototype has been reviewed. Great work on the layout!", time: "2 hrs ago", mine: false },
    { id: 2, sender: "You", text: "Thank you! I will work on the feedback for the next submission.", time: "1 hr ago", mine: true },
  ]);

  // ─── Rewards ───────────────────────────────────────────
  const [redeemed, setRedeemed] = useState([]);

  const storeItems = [
    { id: 1, title: "Introduction to React v19", cost: 80 },
    { id: 2, title: "Data Structures Deep Dive", cost: 100 },
    { id: 3, title: "Machine Learning A–Z", cost: 120 },
    { id: 4, title: "Clean Code Handbook", cost: 60 },
  ];

  const handleRedeem = async (item) => {
    if (tokens < item.cost || redeemed.includes(item.id)) return;
    try {
        await spendTokens(studentDbId, item.cost);
        setRedeemed((prev) => [...prev, item.id]);
        await fetchTokenBalance(); // refresh from DB
    } catch (error) {
        console.error("Redeem failed:", error.response?.data);
    }
};

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: "You", text: newMessage.trim(), time: "Just now", mine: true }]);
    setNewMessage("");
  };

  const pendingCount = assignments.filter((a) => !getSubmissionForAssignment(a.id)).length;
  const enrolledCount = enrollments.length;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="brand-header">
          <span className="brand-logo"></span> Mentora
        </div>
        <nav className="nav-menu">
          <button className={activeTab === "overview"    ? "active" : ""} onClick={() => setActiveTab("overview")}> Overview</button>
          <button className={activeTab === "courses"     ? "active" : ""} onClick={() => setActiveTab("courses")}> Courses</button>
          <button className={activeTab === "lessons"     ? "active" : ""} onClick={() => setActiveTab("lessons")}> Lessons</button>
          <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
             Assignments {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </button>
          <button className={activeTab === "messages"    ? "active" : ""} onClick={() => setActiveTab("messages")}> Messages</button>
          <button className={activeTab === "rewards"     ? "active" : ""} onClick={() => setActiveTab("rewards")}> Rewards</button>
        </nav>
        <div className="sidebar-footer">
          <span className="user-id">{studentRegNo}</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>Logout</button>
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

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="tab-view animate-fade">
            <section className="metrics-grid">
              <div className="metric-card"><label>Enrolled Courses</label><h3>{enrolledCount} Active</h3></div>
              <div className="metric-card"><label>Pending Assignments</label><h3>{pendingCount} Due</h3></div>
              <div className="metric-card"><label>Token Balance</label><h3>✨ {tokens}</h3></div>
              <div className="metric-card"><label>Books Redeemed</label><h3>{redeemed.length} Books</h3></div>
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
                <button className="view-all-btn" onClick={() => setActiveTab("messages")}>View all messages →</button>
              </div>
              <div className="right-pane">
                <h2 className="pane-title">My Enrollments</h2>
                {enrollments.map((e) => (
                  <div key={e.id} className="deadline-item">
                    <span>{e.course?.courseCode} — {e.course?.title}</span>
                    <span className="due-date">{e.progress}%</span>
                  </div>
                ))}
                {enrollments.length === 0 && <p className="empty-note">No courses enrolled yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Courses ── */}
        {activeTab === "courses" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Course Enrollment Catalog</h2>
            <div className="catalog-grid">
              {courses.length === 0 && <p className="empty-note">No published courses available yet.</p>}
              {courses.map((course) => {
                const enrollment = enrollments.find((e) => e.course.id === course.id);
                const isEnrolled = !!enrollment;
                return (
                  <div key={course.id} className="catalog-card">
                    <div className="card-top">
                      <span className="code">{course.courseCode}</span>
                      <h3>{course.title}</h3>
                      <p className="card-meta">
                        {course.lecturer?.name || "No lecturer"} • {course.students} students
                      </p>
                    </div>
                    {isEnrolled ? (
                      <div className="enroll-status">
                        <div className="prog-track">
                          <div className="prog-fill" style={{ width: `${enrollment.progress}%` }}></div>
                        </div>
                        <span className="percent">{enrollment.progress}% Completed</span>
                        {enrollment.completed && <span className="grade-badge">✓ Completed</span>}
                        <button className="action-btn drop" onClick={() => handleEnroll(course)}>Drop Course</button>
                      </div>
                    ) : (
                      <button className="action-btn enroll" onClick={() => handleEnroll(course)}>Enroll</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Lessons ── */}
        {activeTab === "lessons" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Course Lessons</h2>

            <div className="form-row" style={{ marginBottom: 20 }}>
              <select
                className="dash-input sm"
                value={selectedLessonCourseId || ""}
                onChange={(e) => { setSelectedLessonCourseId(Number(e.target.value)); setActiveLesson(null); }}
              >
                <option value="">-- Select a Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseCode} — {c.title}</option>
                ))}
              </select>
            </div>

            {/* Video player */}
            {activeLesson && activeLesson.type === "video" && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ marginBottom: 8 }}>{activeLesson.title}</h4>
                <video
                  controls
                  style={{ width: "100%", maxWidth: 720, borderRadius: 8, background: "#000" }}
                  src={`http://localhost:8080/api/lessons/file/${activeLesson.fileName}`}
                />
                <button className="action-btn drop" style={{ marginTop: 8 }} onClick={() => setActiveLesson(null)}>Close</button>
              </div>
            )}

            <div className="assignments-stack">
              {!selectedLessonCourseId && <p className="empty-note">Select a course to view its lessons.</p>}
              {selectedLessonCourseId && lessons.length === 0 && <p className="empty-note">No lessons available for this course yet.</p>}
              {lessons.sort((a, b) => a.lessonOrder - b.lessonOrder).map((l) => (
                <div key={l.id} className="assignment-strip">
                  <div className="meta">
                    <h4>{l.lessonOrder}. {l.title}</h4>
                    <span className="sub">{l.fileName}</span>
                  </div>
                  <span className={`status-tag ${l.type}`}>
                    {l.type === "pdf" ? "PDF" : l.type === "video" ? "Video" : "Revision"}
                  </span>
                  {l.type === "video" ? (
                    <button className="action-btn enroll" onClick={() => setActiveLesson(l)}>
                      ▶ Play
                    </button>
                  ) : (
                    <a
                      href={`http://localhost:8080/api/lessons/file/${l.fileName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn enroll"
                    >
                      Open
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Assignments ── */}
        {activeTab === "assignments" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Academic Assignments</h2>

            {/* Course filter */}
            <div className="form-row" style={{ marginBottom: 20 }}>
              <select
                className="dash-input sm"
                value={selectedAssignmentCourseId || ""}
                onChange={(e) => setSelectedAssignmentCourseId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Select a Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseCode} — {c.title}</option>
                ))}
              </select>
            </div>

            {!selectedAssignmentCourseId && <p className="empty-note">Select a course to view its assignments.</p>}

            <div className="assignments-stack">
              {assignments.map((asm) => {
                const submission = getSubmissionForAssignment(asm.id);
                return (
                  <div key={asm.id} className="assignment-strip">
                    <div className="meta">
                      <h4>{asm.title}</h4>
                      <span className="sub">
                        Due: {asm.dueDate} • +{asm.tokenReward} Tokens
                      </span>
                    </div>
                    <div className="status-zone">
                      {submission ? (
                        <>
                          <span className={`status-tag ${submission.status.toLowerCase()}`}>
                            {submission.status}
                          </span>
                          {submission.grade && (
                            <span className="grade-badge">Grade: {submission.grade}</span>
                          )}
                        </>
                      ) : (
                        <span className="status-tag pending">Pending</span>
                      )}
                    </div>
                    <div className="actions">
                      {!submission && uploadingId !== asm.id && (
                        <button className="upload-trigger-btn" onClick={() => setUploadingId(asm.id)}>
                          Upload & Submit
                        </button>
                      )}
                      {uploadingId === asm.id && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <label className="file-label">
                            {uploadFile ? uploadFile.name : "Choose file"}
                            <input type="file" hidden onChange={(e) => setUploadFile(e.target.files[0])} />
                          </label>
                          <button className="add-btn" onClick={() => handleSubmit(asm.id)} disabled={!uploadFile}>
                            Submit
                          </button>
                          <button className="action-btn drop" onClick={() => { setUploadingId(null); setUploadFile(null); }}>
                            Cancel
                          </button>
                        </div>
                      )}
                      {submission?.status === "SUBMITTED" && (
                        <span className="waiting-label">⏳ Awaiting grade</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {selectedAssignmentCourseId && assignments.length === 0 && (
                <p className="empty-note">No assignments for this course yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
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

        {/* ── Rewards ── */}
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
                    <h4>{item.title}</h4>
                    <span className="item-cost">{item.cost} Tokens</span>
                    <button
                      className="redeem-btn"
                      disabled={tokens < item.cost || owned}
                      onClick={() => handleRedeem(item)}
                    >
                      {owned ? "✓ Redeemed" : tokens < item.cost ? "Not enough tokens" : "Redeem Free"}
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