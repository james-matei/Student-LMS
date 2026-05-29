import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/TeacherDashboard.css";
import "../styles/Dashboard.css";

function TeacherDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [teacherId] = useState(location.state?.teacherId || "T202600123");
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Courses ───────────────────────────────────────────
  const [courses, setCourses] = useState([
    {
      id: 1, title: "Advanced Web UI Design", code: "CS-402",
      students: 34, lessons: 12, published: true,
    },
    {
      id: 2, title: "Data Structures & Algorithms", code: "CS-204",
      students: 28, lessons: 9, published: true,
    },
    {
      id: 3, title: "Machine Learning Foundations", code: "AI-301",
      students: 0, lessons: 4, published: false,
    },
  ]);

  const [newCourse, setNewCourse] = useState({ title: "", code: "" });

  // ─── Lessons ───────────────────────────────────────────
  const [lessons, setLessons] = useState([
    { id: 1, courseId: 1, title: "Intro to Flexbox", type: "pdf", file: "flexbox.pdf", order: 1 },
    { id: 2, courseId: 1, title: "CSS Grid Masterclass", type: "video", file: "grid.mp4", order: 2 },
    { id: 3, courseId: 2, title: "Big O Notation", type: "pdf", file: "bigo.pdf", order: 1 },
    { id: 4, courseId: 1, title: "Exam Prep Notes", type: "revision", file: "notes.pdf", order: 3 },
  ]);

  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [newLesson, setNewLesson] = useState({ title: "", type: "pdf", file: null });

  // ─── Assignments ───────────────────────────────────────
  const [assignments, setAssignments] = useState([
    {
      id: 101, courseId: 1, title: "UI Prototype Sketching",
      dueDate: "2025-06-10", submissions: [
        { studentId: "S202609874", name: "Alex M.", file: "ui_v1.pdf", grade: "A+", graded: true },
        { studentId: "S202609875", name: "Jordan K.", file: "ui_v2.pdf", grade: "", graded: false },
      ],
    },
    {
      id: 102, courseId: 2, title: "Algorithm Lab 4",
      dueDate: "2025-06-15", submissions: [
        { studentId: "S202609876", name: "Sam R.", file: "algo.pdf", grade: "", graded: false },
      ],
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({ title: "", courseId: 1, dueDate: "" });

  // ─── Quizzes ───────────────────────────────────────────
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
    title: "", courseId: 1,
    questions: [{ q: "", options: ["", "", "", ""], answer: 0 }],
  });

  // ─── Course actions ────────────────────────────────────
  const addCourse = () => {
    if (!newCourse.title || !newCourse.code) return;
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), title: newCourse.title, code: newCourse.code, students: 0, lessons: 0, published: false },
    ]);
    setNewCourse({ title: "", code: "" });
  };

  const togglePublish = (id) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, published: !c.published } : c));
  };

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // ─── Lesson actions ────────────────────────────────────
  const addLesson = () => {
    if (!newLesson.title) return;
    const courseLessons = lessons.filter((l) => l.courseId === selectedCourseId);
    setLessons((prev) => [
      ...prev,
      { id: Date.now(), courseId: selectedCourseId, title: newLesson.title, type: newLesson.type, file: newLesson.file?.name || "uploaded_file", order: courseLessons.length + 1 },
    ]);
    setNewLesson({ title: "", type: "pdf", file: null });
  };

  const deleteLesson = (id) => setLessons((prev) => prev.filter((l) => l.id !== id));

  // ─── Assignment grading ────────────────────────────────
  const gradeSubmission = (assignmentId, studentId, grade) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, submissions: a.submissions.map((s) => s.studentId === studentId ? { ...s, grade, graded: true } : s) }
          : a
      )
    );
  };

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.dueDate) return;
    setAssignments((prev) => [
      ...prev,
      { id: Date.now(), courseId: Number(newAssignment.courseId), title: newAssignment.title, dueDate: newAssignment.dueDate, submissions: [] },
    ]);
    setNewAssignment({ title: "", courseId: 1, dueDate: "" });
  };

  // ─── Quiz actions ──────────────────────────────────────
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
    setBuildingQuiz({ title: "", courseId: 1, questions: [{ q: "", options: ["", "", "", ""], answer: 0 }] });
  };

  const pendingGrades = assignments.reduce((acc, a) => acc + a.submissions.filter((s) => !s.graded).length, 0);

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
          <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
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
              <div className="metric-card">
                <label>Total Courses</label>
                <h3>{courses.length}</h3>
              </div>
              <div className="metric-card">
                <label>Published</label>
                <h3>{courses.filter((c) => c.published).length}</h3>
              </div>
              <div className="metric-card">
                <label>Total Students</label>
                <h3>{courses.reduce((a, c) => a + c.students, 0)}</h3>
              </div>
              <div className="metric-card">
                <label>Pending Grades</label>
                <h3>{pendingGrades}</h3>
              </div>
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Your Courses</h2>
                {courses.map((c) => (
                  <div key={c.id} className="overview-row">
                    <span className="code">{c.code}</span>
                    <span className="row-title">{c.title}</span>
                    <span className={`pub-dot ${c.published ? "live" : "draft"}`}>
                      {c.published ? "Live" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="right-pane">
                <h2 className="pane-title">Needs Grading</h2>
                {assignments.map((a) =>
                  a.submissions.filter((s) => !s.graded).map((s) => (
                    <div key={s.studentId} className="deadline-item">
                      <span>{s.name} — {a.title}</span>
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
              <input className="dash-input sm" placeholder="Code e.g. CS-101" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} />
              <button className="add-btn" onClick={addCourse}>+ Add Course</button>
            </div>

            <div className="catalog-grid">
              {courses.map((c) => (
                <div key={c.id} className="catalog-card">
                  <div className="card-top">
                    <span className="code">{c.code}</span>
                    <h3>{c.title}</h3>
                    <p className="card-meta">{c.students} students • {c.lessons} lessons</p>
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
              <select className="dash-input sm" value={selectedCourseId} onChange={(e) => setSelectedCourseId(Number(e.target.value))}>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>

            <div className="form-row" style={{ marginTop: 16 }}>
              <input className="dash-input" placeholder="Lesson title" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} />
              <select className="dash-input sm" value={newLesson.type} onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}>
                <option value="pdf"> PDF</option>
                <option value="video"> Video</option>
                <option value="revision"> Revision</option>
              </select>
              <label className="file-label">
                {newLesson.file ? newLesson.file.name : "Choose file"}
                <input type="file" hidden accept=".pdf,.mp4,.mov,.ppt,.pptx" onChange={(e) => setNewLesson({ ...newLesson, file: e.target.files[0] })} />
              </label>
              <button className="add-btn" onClick={addLesson}>+ Add</button>
            </div>

            <div className="assignments-stack" style={{ marginTop: 20 }}>
              {lessons.filter((l) => l.courseId === selectedCourseId)
                .sort((a, b) => a.order - b.order)
                .map((l) => (
                  <div key={l.id} className="assignment-strip">
                    <div className="meta">
                      <h4>{l.order}. {l.title}</h4>
                      <span className="sub">{l.file}</span>
                    </div>
                    <span className={`status-tag ${l.type}`}>
                      {l.type === "pdf" ? " PDF" : l.type === "video" ? " Video" : " Revision"}
                    </span>
                    <button className="action-btn drop" onClick={() => deleteLesson(l.id)}>Remove</button>
                  </div>
                ))}
              {lessons.filter((l) => l.courseId === selectedCourseId).length === 0 && (
                <p className="empty-note">No lessons yet for this course.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Assignments ── */}
        {activeTab === "assignments" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Assignments & Grading</h2>

            <div className="form-row">
              <input className="dash-input" placeholder="Assignment title" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
              <select className="dash-input sm" value={newAssignment.courseId} onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
              </select>
              <input className="dash-input sm" type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
              <button className="add-btn" onClick={addAssignment}>+ Add</button>
            </div>

            <div className="assignments-stack" style={{ marginTop: 20 }}>
              {assignments.map((a) => (
                <div key={a.id} className="assignment-block">
                  <div className="assignment-header">
                    <h4>{a.title}</h4>
                    <span className="sub">Due: {a.dueDate} • {a.submissions.length} submission{a.submissions.length !== 1 ? "s" : ""}</span>
                  </div>

                  {a.submissions.length === 0 && <p className="empty-note">No submissions yet.</p>}

                  {a.submissions.map((s) => (
                    <div key={s.studentId} className="submission-row">
                      <div className="meta">
                        <span className="student-name">{s.name}</span>
                        <span className="sub">📎 {s.file}</span>
                      </div>
                      {s.graded ? (
                        <span className="grade-badge"> {s.grade}</span>
                      ) : (
                        <div className="grade-input-row">
                          <input
                            className="dash-input sm"
                            placeholder="Grade e.g. A+"
                            onBlur={(e) => { if (e.target.value) gradeSubmission(a.id, s.studentId, e.target.value); }}
                          />
                          <span className="waiting-label">Awaiting grade</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quizzes ── */}
        {activeTab === "quizzes" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Quizzes</h2>

            {/* Existing quizzes */}
            <div className="assignments-stack" style={{ marginBottom: 28 }}>
              {quizzes.map((q) => (
                <div key={q.id} className="assignment-block">
                  <div className="assignment-header">
                    <h4>{q.title}</h4>
                    <span className="sub">{courses.find((c) => c.id === q.courseId)?.code} • {q.questions.length} questions</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz builder */}
            <div className="quiz-builder">
              <h2 className="pane-title">Build a Quiz</h2>
              <div className="form-row">
                <input className="dash-input" placeholder="Quiz title" value={buildingQuiz.title} onChange={(e) => setBuildingQuiz({ ...buildingQuiz, title: e.target.value })} />
                <select className="dash-input sm" value={buildingQuiz.courseId} onChange={(e) => setBuildingQuiz({ ...buildingQuiz, courseId: e.target.value })}>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
                </select>
              </div>

              {buildingQuiz.questions.map((q, i) => (
                <div key={i} className="question-block">
                  <input className="dash-input" placeholder={`Question ${i + 1}`} value={q.q} onChange={(e) => updateQuestion(i, "q", e.target.value)} />
                  <div className="options-grid">
                    {q.options.map((opt, j) => (
                      <div key={j} className="option-row">
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          checked={q.answer === j}
                          onChange={() => updateQuestion(i, "answer", j)}
                        />
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