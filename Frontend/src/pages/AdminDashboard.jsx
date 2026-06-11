// src/pages/AdminDashboard.jsx
import { useState ,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import "../styles/AdminDashboard.css";
import "../styles/Dashboard.css";
import {  createUser,  createTeacher,  createAdmin,  getAllUsers, suspendUser, restoreUser, deleteUserById} from "../services/userService";
import { getAllCourses, deleteCourseById, togglePublishCourse} from "../services/courseService";

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminId] = useState(location.state?.adminId || "A000000001");
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Users ─────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
}, []);

const fetchUsers = async () => {
    try {
        const response = await getAllUsers();
        setUsers(response.data);
    } catch (error) {
        console.error("Failed to load users", error);
    }
};

  const [newUser, setNewUser] = useState({
  name: "",
  regNO: "",
  email: "",
  password: "",
  role: "ROLE_STUDENT"
});
  const [userSearch, setUserSearch] = useState("");

  // ─── Courses ───────────────────────────────────────────
 const [courses, setCourses] = useState([]);
 useEffect(() => {
    fetchCourses();
}, []);

const fetchCourses = async () => {
    try {
        const response = await getAllCourses();
         console.log("COURSES FROM BACKEND:", response.data);
        setCourses(response.data);
    } catch (error) {
        console.error(error);
    }
};

const deleteCourse = async (id) => {
    try {
        await deleteCourseById(id);
        await fetchCourses();
    } catch (error) {
        console.error(error);
    }
};

  // ─── Announcements ─────────────────────────────────────
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
  fetchAnnouncements();
}, []);

const fetchAnnouncements = async () => {
  const res = await getAnnouncements();
  setAnnouncements(res.data);
} ;

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", body: "", target: "all" });

  // ─── Reports ───────────────────────────────────────────
  const reports = [
    { label: "Total Users",        value: users.length },
    { label: "Active Students",    value: users.filter(u => u.role === "ROLE_STUDENT" && u.status === "ACTIVE").length },
    { label: "Teachers",           value: users.filter(u => u.role === "ROLE_TEACHER").length },
    { label: "Total Courses",      value: courses.length },
    { label: "Published Courses",  value: courses.filter(c => c.published).length },
    { label: "Suspended Accounts", value: users.filter(u => u.status === "SUSPENDED").length },
  ];

  // ─── User actions ──────────────────────────────────────
  const addUser = async () => {
  try {

    let response;

    if (newUser.role === "ROLE_TEACHER") {
      response = await createTeacher(newUser);
    } else if (newUser.role === "ROLE_ADMIN") {
      response = await createAdmin(newUser);
    } else {
       response = await createUser(newUser);
    }
   

   await fetchUsers();

    setNewUser({
      name: "",
      regNO: "",
      email: "",
      password: "",
      role: "ROLE_STUDENT"
    });

    alert("User created successfully");

  } catch (error) {
    console.error(error);
    alert("Failed to create user");
  }
};

const toggleSuspend = async (user) => {
  try {

    if (user.status === "ACTIVE") {
      await suspendUser(user.id);
    } else {
      await restoreUser(user.id);
    }

    await fetchUsers();

  } catch (error) {
    console.error(error);
    alert("Failed to update user status");
  }
};  

   // ─── Course actions ────────────────────────────────────
  const toggleCourse = async (id) => {
    try {
        await togglePublishCourse(id);
        fetchCourses();
    } catch (error) {
        console.error("Toggle failed:", error);
    }
};

  const deleteUser = async (id) => {
  try {

    await deleteUserById(id);

    await fetchUsers();

  } catch (error) {
    console.error(error);
    alert("Failed to delete user");
  }
};

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

  const filteredUsers = (users || []).filter(u =>
  (u?.name || "").toLowerCase().includes((userSearch || "").toLowerCase()) ||
  (u?.regNO || "").toLowerCase().includes((userSearch || "").toLowerCase())
);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="brand-header"> Mentora</div>
        <nav className="nav-menu">
          <button className={activeTab === "overview"       ? "active" : ""} onClick={() => setActiveTab("overview")}> Overview</button>
          <button className={activeTab === "users"          ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
          <button className={activeTab === "courses"        ? "active" : ""} onClick={() => setActiveTab("courses")}> Courses</button>
          <button className={activeTab === "announcements"  ? "active" : ""} onClick={() => setActiveTab("announcements")}> Announcements</button>
          <button className={activeTab === "reports"        ? "active" : ""} onClick={() => setActiveTab("reports")}> Reports</button>
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
            <div className="token-pill"> Administrator</div>
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
                    <span className="sub">{u.regNO}</span>
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
          

              <input className="dash-input sm" placeholder="Reg No e.g. S202600001" value={newUser.regNO} onChange={e => setNewUser({ ...newUser, regNO: e.target.value })} />
              <input className="dash-input sm" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <input className="dash-input sm" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <select className="dash-input sm" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
              <button className="add-btn" onClick={addUser}>+ Add User</button>
            </div>

            <input
              className="dash-input"
              placeholder=" Search by name or reg number..."
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
                  <span className="sub">{u.regNO}</span>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                  <span className={`pub-dot ${u.status === "active" ? "live" : "draft"}`}>{u.status}</span>
                  <div className="row-actions">
                    <button className={`action-btn ${u.status === "active" ? "drop" : "enroll"}`} onClick={() => toggleSuspend(u)}>
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
                    <span className="code">{c.courseCode}</span>
                    <h3>{c.title}</h3>
                    <p className="card-meta"> {c.lecturer?.name || "No lecturer"} • {c.students} students</p>
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
                <button className="add-btn" onClick={addAnnouncement}> Post</button>
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
                  <p style={{ fontSize: 13, color: "rgba(0, 0, 0, 0.29)", marginTop: 8, lineHeight: 1.6 }}>{a.body}</p>
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
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(0, 0, 0, 0.55)", marginBottom: 6 }}>
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
                    <span className="code">{c.courseCode}</span>
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