// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminId] = useState(location.state?.adminId || "A000000001");
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Users ─────────────────────────────────────────────
  const [users, setUsers] = useState([
    { id: 1, name: "Alex M.",     regNo: "S202609874", role: "student", status: "active" },
    { id: 2, name: "Jordan K.",   regNo: "S202609875", role: "student", status: "active" },
    { id: 3, name: "Dr. Sarah J.",regNo: "T202600123", role: "teacher", status: "active" },
    { id: 4, name: "Prof. Dan W.",regNo: "T202600124", role: "teacher", status: "suspended" },
    { id: 5, name: "Sam R.",      regNo: "S202609876", role: "student", status: "active" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", regNo: "", role: "student" });
  const [userSearch, setUserSearch] = useState("");

  // ─── Courses ───────────────────────────────────────────
  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced Web UI Design",        code: "CS-402", teacher: "Dr. Sarah J.", students: 34, published: true  },
    { id: 2, title: "Data Structures & Algorithms",  code: "CS-204", teacher: "Dr. Sarah J.", students: 28, published: true  },
    { id: 3, title: "Machine Learning Foundations",  code: "AI-301", teacher: "Prof. Dan W.", students: 0,  published: false },
  ]);

  // ─── Announcements ─────────────────────────────────────
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Semester Start",      body: "The new semester begins June 1st. All students must be enrolled.", date: "2025-05-20", target: "all"     },
    { id: 2, title: "Teacher PD Day",      body: "Professional development day on May 30th. No classes scheduled.",  date: "2025-05-22", target: "teacher" },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", body: "", target: "all" });

  // ─── Reports ───────────────────────────────────────────
  const reports = [
    { label: "Total Users",        value: users.length },
    { label: "Active Students",    value: users.filter(u => u.role === "student" && u.status === "active").length },
    { label: "Teachers",           value: users.filter(u => u.role === "teacher").length },
    { label: "Total Courses",      value: courses.length },
    { label: "Published Courses",  value: courses.filter(c => c.published).length },
    { label: "Suspended Accounts", value: users.filter(u => u.status === "suspended").length },
  ];

  // ─── User actions ──────────────────────────────────────
  const addUser = () => {
    if (!newUser.name || !newUser.regNo) return;
    setUsers(prev => [...prev, { id: Date.now(), ...newUser, status: "active" }]);
    setNewUser({ name: "", regNo: "", role: "student" });
  };

  const toggleSuspend = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    ));
  };

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  // ─── Course actions ────────────────────────────────────
  const toggleCourse = (id) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, published: !c.published } : c
    ));
  };

  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  // ─── Announcement actions ──────────────────────────────
  const addAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.body) return;
    setAnnouncements(prev => [...prev, {
      id: Date.now(),
      ...newAnnouncement,
      date: new Date().toISOString().split("T")[0],
    }]);
    setNewAnnouncement({ title: "", body: "", target: "all" });
  };

  const deleteAnnouncement = (id) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.regNo.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="brand-header">🎓 EduSync</div>
        <nav className="nav-menu">
          <button className={activeTab === "overview"       ? "active" : ""} onClick={() => setActiveTab("overview")}>🎛️ Overview</button>
          <button className={activeTab === "users"          ? "active" : ""} onClick={() => setActiveTab("users")}>👥 Users</button>
          <button className={activeTab === "courses"        ? "active" : ""} onClick={() => setActiveTab("courses")}>📚 Courses</button>
          <button className={activeTab === "announcements"  ? "active" : ""} onClick={() => setActiveTab("announcements")}>📢 Announcements</button>
          <button className={activeTab === "reports"        ? "active" : ""} onClick={() => setActiveTab("reports")}>📊 Reports</button>
        </nav>
        <div className="sidebar-footer">
          <span className="user-id">{adminId}</span>
          <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-viewport">
        <header className="dash-header">
          <h1>Admin Panel</h1>
          <div className="header-widgets">
            <div className="token-pill">🔑 Administrator</div>
            <div className="avatar">{adminId.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="tab-view animate-fade">
            <section className="metrics-grid">
              {reports.map(r => (
                <div key={r.label} className="metric-card">
                  <label>{r.label}</label>
                  <h3>{r.value}</h3>
                </div>
              ))}
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Recent Users</h2>
                {users.slice(0, 4).map(u => (
                  <div key={u.id} className="overview-row">
                    <span className={`role-dot ${u.role}`}>{u.role === "student" ? "S" : "T"}</span>
                    <span className="row-title">{u.name}</span>
                    <span className="sub">{u.regNo}</span>
                    <span className={`pub-dot ${u.status === "active" ? "live" : "draft"}`}>
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="right-pane">
                <h2 className="pane-title">Latest Announcements</h2>
                {announcements.map(a => (
                  <div key={a.id} className="deadline-item">
                    <span>{a.title}</span>
                    <span className="due-date">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Manage Users</h2>

            <div className="form-row">
              <input className="dash-input" placeholder="Full name" value={newUser.name}  onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              <input className="dash-input sm" placeholder="Reg No e.g. S202600001" value={newUser.regNo} onChange={e => setNewUser({ ...newUser, regNo: e.target.value })} />
              <select className="dash-input sm" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <button className="add-btn" onClick={addUser}>+ Add User</button>
            </div>

            <input
              className="dash-input"
              placeholder="🔍 Search by name or reg number..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              style={{ marginBottom: 16, maxWidth: 360 }}
            />

            <div className="user-table">
              <div className="table-head">
                <span>Name</span>
                <span>Reg No</span>
                <span>Role</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {filteredUsers.map(u => (
                <div key={u.id} className="table-row">
                  <span className="row-title">{u.name}</span>
                  <span className="sub">{u.regNo}</span>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                  <span className={`pub-dot ${u.status === "active" ? "live" : "draft"}`}>{u.status}</span>
                  <div className="row-actions">
                    <button className={`action-btn ${u.status === "active" ? "drop" : "enroll"}`} onClick={() => toggleSuspend(u.id)}>
                      {u.status === "active" ? "Suspend" : "Restore"}
                    </button>
                    <button className="action-btn drop" onClick={() => deleteUser(u.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <p className="empty-note" style={{ padding: "12px 0" }}>No users found.</p>}
            </div>
          </div>
        )}

        {/* ── Courses ── */}
        {activeTab === "courses" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">All Courses</h2>
            <div className="catalog-grid">
              {courses.map(c => (
                <div key={c.id} className="catalog-card">
                  <div className="card-top">
                    <span className="code">{c.code}</span>
                    <h3>{c.title}</h3>
                    <p className="card-meta">👩‍🏫 {c.teacher} • {c.students} students</p>
                  </div>
                  <div className="card-actions">
                    <span className={`pub-dot ${c.published ? "live" : "draft"}`}>
                      {c.published ? "Published" : "Draft"}
                    </span>
                    <button className={`action-btn ${c.published ? "drop" : "enroll"}`} onClick={() => toggleCourse(c.id)}>
                      {c.published ? "Unpublish" : "Publish"}
                    </button>
                    <button className="action-btn drop" onClick={() => deleteCourse(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Announcements ── */}
        {activeTab === "announcements" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">Announcements</h2>

            <div className="announcement-form">
              <input
                className="dash-input"
                placeholder="Announcement title"
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <div className="form-row" style={{ marginTop: 10 }}>
                <select className="dash-input sm" value={newAnnouncement.target} onChange={e => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}>
                  <option value="all">Everyone</option>
                  <option value="student">Students only</option>
                  <option value="teacher">Teachers only</option>
                </select>
                <button className="add-btn" onClick={addAnnouncement}>📢 Post</button>
              </div>
              <textarea
                className="dash-input"
                placeholder="Write your announcement..."
                rows={3}
                value={newAnnouncement.body}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })}
                style={{ marginTop: 10, resize: "vertical" }}
              />
            </div>

            <div className="assignments-stack" style={{ marginTop: 24 }}>
              {announcements.map(a => (
                <div key={a.id} className="assignment-block">
                  <div className="assignment-header">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4>{a.title}</h4>
                        <span className="sub">{a.date} • To: {a.target}</span>
                      </div>
                      <button className="action-btn drop" onClick={() => deleteAnnouncement(a.id)}>Delete</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8, lineHeight: 1.6 }}>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Reports ── */}
        {activeTab === "reports" && (
          <div className="tab-view animate-fade">
            <h2 className="pane-title">System Reports</h2>
            <section className="metrics-grid" style={{ marginBottom: 28 }}>
              {reports.map(r => (
                <div key={r.label} className="metric-card">
                  <label>{r.label}</label>
                  <h3>{r.value}</h3>
                </div>
              ))}
            </section>

            <div className="dual-layout">
              <div className="left-pane">
                <h2 className="pane-title">Users by Role</h2>
                {["student", "teacher", "admin"].map(role => {
                  const count = users.filter(u => u.role === role).length;
                  const pct = users.length ? Math.round((count / users.length) * 100) : 0;
                  return (
                    <div key={role} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
                        <span style={{ textTransform: "capitalize" }}>{role}s</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="right-pane">
                <h2 className="pane-title">Course Status</h2>
                {courses.map(c => (
                  <div key={c.id} className="overview-row">
                    <span className="code">{c.code}</span>
                    <span className="row-title">{c.title}</span>
                    <span className={`pub-dot ${c.published ? "live" : "draft"}`}>
                      {c.published ? "Live" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;