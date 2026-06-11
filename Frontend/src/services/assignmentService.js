import api from "./api";

export const getAllAssignments = () => api.get("/assignments");
export const getAssignmentsByCourse = (courseId) => api.get(`/assignments/course/${courseId}`);
export const createAssignment = (assignment) => api.post("/assignments", assignment);
export const deleteAssignmentById = (id) => api.delete(`/assignments/${id}`);
export const updateAssignment = (id, assignment) => api.put(`/assignments/${id}`, assignment);