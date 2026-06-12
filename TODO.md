# Lms-Platform - Task TODO

## Goal
Check `Assignment`-related backend files (e.g. `AssignmentService/Controller/Repository/model/dto`) and frontend files starting with `assignments` plus `teacher.jsx`/`TeacherDashboard.jsx`, and report anything broken.

## Plan (confirmed)
1. Inspect frontend `Frontend/src/pages/TeacherDashboard.jsx` for syntax/runtime issues around assignments.
2. Inspect backend assignment stack (`AssignmentController`, `AssignmentService`, `AssignmentRepository`, `Assignment`, `AssignmentRequest`) for compilation/routing/DTO mismatches.
3. Verify obvious endpoint mismatches with `Frontend/src/services/assignmentService.js`.
4. Report all issues found (with exact locations) and decide whether a fix is needed.

