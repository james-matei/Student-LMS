import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, createCourse, deleteCourseById, togglePublishCourse } from "../services/courseService";
import { getLessonsByCourse, createLesson, deleteLessonById } from "../services/lessonService";
import { getAllAssignments, createAssignment, deleteAssignmentById } from "../services/assignmentService";
import { getSubmissionsByAssignment, gradeSubmission } from "../services/submissionService";
import "../styles/TeacherDashboard.css";
import "../styles/Dashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [teacherId] = useState(storedUser.regNO || "Unknown");
  const [teacherDbId] = useState(storedUser.id || null);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Courses ───────────────────────────────────────────
  const [courses, setCourses] = useState([]);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const [newCourse, setNewCourse] = useState({ title: "", courseCode: "" });

  const addCourse = async () => {
    if (!newCourse.title || !newCourse.courseCode) return;
    try {
      await createCourse({ title: newCourse.title, courseCode: newCourse.courseCode, lecturerId: teacherDbId });
      setNewCourse({ title: "", courseCode: "" });
      fetchCourses();
    } catch (error) {
      console.error("Failed to create course:", error.response?.data);
    }
  };

  const togglePublish = async (id) => {
    try {
      await togglePublishCourse(id);
      fetchCourses();
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteCourseById(id);
      fetchCourses();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ─── Lessons ───────────────────────────────────────────
  const [lessons, setLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: "", type: "pdf", file: null });

  useEffect(() => {
    if (selectedCourseId) fetchLessons(selectedCourseId);
  }, [selectedCourseId]);

  const fetchLessons = async (courseId) => {
    try {
      const response = await getLessonsByCourse(courseId);
      setLessons(response.data);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    }
  };

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.file) return;
    const formData = new FormData();
    formData.append("courseId", selectedCourseId);
    formData.append("title", newLesson.title);
    formData.append("type", newLesson.type);
    formData.append("file", newLesson.file);
    try {
      await createLesson(formData);
      fetchLessons(selectedCourseId);
      setNewLesson({ title: "", type: "pdf", file: null });
    } catch (error) {
      console.error("Failed to add lesson:", error.response?.data);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await deleteLessonById(id);
      fetchLessons(selectedCourseId);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  // ─── Assignments ───────────────────────────────────────
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({}); // { assignmentId: [submissions] }
  const [newAssignment, setNewAssignment] = useState({ title: "", courseId: "", dueDate: "", tokenReward: 0 });
  const [selectedAssignmentCourseId, setSelectedAssignmentCourseId] = useState(null);

  useEffect(() => { fetchAssignments(); }, []);

  const fetchAssignments = async () => {
    try {
      const response = await getAllAssignments();
      setAssignments(response.data);
      // fetch submissions for each assignment
      response.data.forEach((a) => fetchSubmissionsForAssignment(a.id));
    } catch (error) {
      console.error("Failed to load assignments:", error);
    }
  };

  const fetchSubmissionsForAssignment = async (assignmentId) => {
    try {
      const response = await getSubmissionsByAssignment(assignmentId);
      setSubmissions((prev) => ({ ...prev, [assignmentId]: response.data }));
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const addAssignment = async () => {
    if (!newAssignment.title || !newAssignment.courseId || !newAssignment.dueDate) return;
    try {
      await createAssignment({
        title: newAssignment.title,
        dueDate: newAssignment.dueDate,
        tokenReward: Number(newAssignment.tokenReward),
        course: { id: Number(newAssignment.courseId) }
      });
      setNewAssignment({ title: "", courseId: "", dueDate: "", tokenReward: 0 });
      fetchAssignments();
    } catch (error) {
      console.error("Failed to create assignment:", error.response?.data);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await deleteAssignmentById(id);
      fetchAssignments();
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  const handleGrade = async (submissionId, grade, assignmentId) => {
    if (!grade) return;
    try {
      await gradeSubmission(submissionId, grade);
      fetchSubmissionsForAssignment(assignmentId);
    } catch (error) {
      console.error("Failed to grade:", error);
    }
  };

  // pending grades across all assignments
  const pendingGrades = Object.values(submissions)
    .flat()
    .filter((s) => s.status === "SUBMITTED").length;

  // ─── Quizzes (local state for now) ─────────────────────
  const [quizzes, setQuizzes] = useState([
    {
      id: 1, courseId: 1, title: "CSS Fundamentals Quiz",
      questions: [
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Syntax", "Cascading System Style"], answer: 0 },
        { q: "Which property controls text color?", options: ["font-color", "color", "text-color", "style"], answer: 1 },
      ],
    },
  ]);

  const [buildingQuiz, setBuildingQuiz] = useState({
    title: "", courseId: "",
    questions: [{ q: "", options: ["", "", "", ""], answer: 0 }],
  });

  const updateQuestion = (index, field, value) => {
    setBuildingQuiz((prev) => {
      const questions = [...prev.questions];
      if (field === "q") questions[index].q = value;
      else if (field === "answer") questions[index].answer = Number(value);
      else {
        const [, optIdx] = field.split("-");
        questions[index].options[Number(optIdx)] = value;
      }
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setBuildingQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { q: "", options: ["", "", "", ""], answer: 0 }],
    }));
  };

  const saveQuiz = () => {
    if (!buildingQuiz.title) return;
    setQuizzes((prev) => [...prev, { ...buildingQuiz, id: Date.now(), courseId: Number(buildingQuiz.courseId) }]);
    setBuildingQuiz({ title: "", courseId: "", questions: [{ q: "", options: ["", "", "", ""], answer: 0 }] });
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="brand-header">Mentora</div>
        <nav className="nav-menu">
          <button className={activeTab === "overview"    ? "active" : ""} onClick={() => setActiveTab("overview")}> Overview</button>
          <button className={activeTab === "courses"     ? "active" : ""} onClick={() => setActiveTab("courses")}> Courses</button>
          <button className={activeTab === "lessons"     ? "active" : ""} onClick={() => setActiveTab("lessons")}> Lessons</button>
          <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
             Assignments {pendingGrades > 0 && <span className="badge">{pendingGrades}</span>}
          </button>
          <button className={activeTab === "quizzes"    ? "active" : ""} onClick={() => setActiveTab("quizzes")}> Quizzes</button>
        </nav>
        <div className="sidebar-footer">
          <span className="user-id">{teacherId}</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-viewport">
        <header className="dash-header">
          <h1>Teacher Dashboard</h1>
          <div className="header-widgets">
            <div className="token-pill"> Instructor</div>
            <div className="avatar">{teacherId.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="tab-view animate-fade">
            <section className="metrics-grid">
              <div className="metric-card"><label>Total Courses</label><h3>{courses.length}</h3></div>
              <div className="metric-card"><label>Published</label><h3>{courses.filter((c) => c.published).length}</h3></div>
              <div className="metric-card"><label>Total Students</label><h3>{courses.reduce((a, c) => a + (c.students || 0), 0)}</h3></div>
              <div className="metric-card"><label>Pending Grades</label><h3>{pendingGrades}</h3></div>
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Your Courses</h2>
                {courses.map((c) => (
                  <div key={c.id} className="overview-row">
                    <span className="code">{c.courseCode}</span>
                    <span className="row-title">{c.title}</span>
                    <span className={`pub-dot ${c.published ? "live" : "draft"}`}>
                      {c.published ? "Live" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="right-pane">
                <h2 className="pane-title">Needs Grading</h2>
                {Object.entries(submissions).map(([assignmentId, subs]) =>
                  subs.filter((s) => s.status === "SUBMITTED").map((s) => (
                    <div key={s.id} className="deadline-item">
                      <span>{s.student?.name} — {assignments.find(a => a.id === Number(assignmentId))?.title}</span>
                      <button className="mini-btn" onClick={() => setActiveTab("assignments")}>Grade</button>
                    </div>
                  ))
                )}
                {pendingGrades === 0 && <p className="empty-note">All caught up ✓</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Courses ── */}
        {activeTab === "courses" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Manage Courses</h2>
            <div className="form-row">
              <input className="dash-input" placeholder="Course title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
              <input className="dash-input sm" placeholder="Code e.g. CS-101" value={newCourse.courseCode} onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })} />
              <button className="add-btn" onClick={addCourse}>+ Add Course</button>
            </div>
            <div className="catalog-grid">
              {courses.map((c) => (
                <div key={c.id} className="catalog-card">
                  <div className="card-top">
                    <span className="code">{c.courseCode}</span>
                    <h3>{c.title}</h3>
                    <p className="card-meta">{c.students || 0} students</p>
                  </div>
                  <div className="card-actions">
                    <button className={`action-btn ${c.published ? "drop" : "enroll"}`} onClick={() => togglePublish(c.id)}>
                      {c.published ? "Unpublish" : "Publish"}
                    </button>
                    <button className="action-btn drop" onClick={() => deleteCourse(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Lessons ── */}
        {activeTab === "lessons" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Organise Lessons</h2>
            <div className="form-row">
              <select className="dash-input sm" value={selectedCourseId || ""} onChange={(e) => setSelectedCourseId(Number(e.target.value))}>
                <option value="">-- Select Course --</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.courseCode} — {c.title}</option>)}
              </select>
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <input className="dash-input" placeholder="Lesson title" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} />
              <select className="dash-input sm" value={newLesson.type} onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="revision">Revision</option>
              </select>
              <label className="file-label">
                {newLesson.file ? newLesson.file.name : "Choose file"}
                <input type="file" hidden accept=".pdf,.mp4,.mov,.ppt,.pptx" onChange={(e) => setNewLesson({ ...newLesson, file: e.target.files[0] })} />
              </label>
              <button className="add-btn" onClick={addLesson}>+ Add</button>
            </div>
            <div className="assignments-stack" style={{ marginTop: 20 }}>
              {!selectedCourseId && <p className="empty-note">Select a course to manage its lessons.</p>}
              {selectedCourseId && lessons.length === 0 && <p className="empty-note">No lessons yet for this course.</p>}
              {lessons.sort((a, b) => a.lessonOrder - b.lessonOrder).map((l) => (
                <div key={l.id} className="assignment-strip">
                  <div className="meta">
                    <h4>{l.lessonOrder}. {l.title}</h4>
                    <span className="sub">{l.fileName}</span>
                  </div>
                  <span className={`status-tag ${l.type}`}>
                    {l.type === "pdf" ? "PDF" : l.type === "video" ? "Video" : "Revision"}
                  </span>
                  <button className="action-btn drop" onClick={() => deleteLesson(l.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Assignments ── */}
        {activeTab === "assignments" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Assignments & Grading</h2>

            {/* Create assignment form */}
            <div className="form-row">
              <input className="dash-input" placeholder="Assignment title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
              <select className="dash-input sm"
                value={newAssignment.courseId}
                onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}>
                <option value="">-- Course --</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.courseCode}</option>)}
              </select>
              <input className="dash-input sm" type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
              <input className="dash-input sm" type="number" placeholder="Token reward"
                value={newAssignment.tokenReward}
                onChange={(e) => setNewAssignment({ ...newAssignment, tokenReward: e.target.value })} />
              <button className="add-btn" onClick={addAssignment}>+ Add</button>
            </div>

            {/* Filter by course */}
            <div className="form-row" style={{ marginTop: 12 }}>
              <select className="dash-input sm"
                value={selectedAssignmentCourseId || ""}
                onChange={(e) => setSelectedAssignmentCourseId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Courses</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.courseCode} — {c.title}</option>)}
              </select>
            </div>

            <div className="assignments-stack" style={{ marginTop: 20 }}>
              {assignments
                .filter((a) => !selectedAssignmentCourseId || a.course?.id === selectedAssignmentCourseId)
                .map((a) => {
                  const assignmentSubmissions = submissions[a.id] || [];
                  return (
                    <div key={a.id} className="assignment-block">
                      <div className="assignment-header">
                        <h4>{a.title}</h4>
                        <span className="sub">
                          {a.course?.courseCode} • Due: {a.dueDate} • {a.tokenReward} tokens • {assignmentSubmissions.length} submission{assignmentSubmissions.length !== 1 ? "s" : ""}
                        </span>
                        <button className="action-btn drop" style={{ marginTop: 6 }} onClick={() => deleteAssignment(a.id)}>Delete</button>
                      </div>

                      {assignmentSubmissions.length === 0 && <p className="empty-note">No submissions yet.</p>}

                      {assignmentSubmissions.map((s) => (
                        <div key={s.id} className="submission-row">
                          <div className="meta">
                            <span className="student-name">{s.student?.name}</span>
                            <span className="sub">
                              📎 {s.fileName} • Submitted: {new Date(s.submittedAt).toLocaleDateString()}
                            </span>
                            <a
                              href={`http://localhost:8080/api/submissions/file/${s.fileName}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mini-btn"
                            >
                              View File
                            </a>
                          </div>
                          {s.status === "GRADED" ? (
                            <span className="grade-badge">✓ {s.grade}</span>
                          ) : (
                            <div className="grade-input-row">
                              <input
                                className="dash-input sm"
                                placeholder="Grade e.g. A+"
                                onBlur={(e) => { if (e.target.value) handleGrade(s.id, e.target.value, a.id); }}
                              />
                              <span className="waiting-label">Awaiting grade</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── Quizzes ── */}
        {activeTab === "quizzes" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Quizzes</h2>
            <div className="assignments-stack" style={{ marginBottom: 28 }}>
              {quizzes.map((q) => (
                <div key={q.id} className="assignment-block">
                  <div className="assignment-header">
                    <h4>{q.title}</h4>
                    <span className="sub">{courses.find((c) => c.id === q.courseId)?.courseCode} • {q.questions.length} questions</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-builder">
              <h2 className="pane-title">Build a Quiz</h2>
              <div className="form-row">
                <input className="dash-input" placeholder="Quiz title" value={buildingQuiz.title} onChange={(e) => setBuildingQuiz({ ...buildingQuiz, title: e.target.value })} />
                <select className="dash-input sm" value={buildingQuiz.courseId} onChange={(e) => setBuildingQuiz({ ...buildingQuiz, courseId: e.target.value })}>
                  <option value="">-- Course --</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.courseCode}</option>)}
                </select>
              </div>
              {buildingQuiz.questions.map((q, i) => (
                <div key={i} className="question-block">
                  <input className="dash-input" placeholder={`Question ${i + 1}`} value={q.q} onChange={(e) => updateQuestion(i, "q", e.target.value)} />
                  <div className="options-grid">
                    {q.options.map((opt, j) => (
                      <div key={j} className="option-row">
                        <input type="radio" name={`correct-${i}`} checked={q.answer === j} onChange={() => updateQuestion(i, "answer", j)} />
                        <input className="dash-input" placeholder={`Option ${j + 1}`} value={opt} onChange={(e) => updateQuestion(i, `opt-${j}`, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <p className="empty-note" style={{ marginTop: 4 }}>Select the radio button next to the correct answer.</p>
                </div>
              ))}
              <div className="form-row" style={{ marginTop: 12 }}>
                <button className="add-btn" onClick={addQuestion}>+ Add Question</button>
                <button className="add-btn save" onClick={saveQuiz}>💾 Save Quiz</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TeacherDashboard;