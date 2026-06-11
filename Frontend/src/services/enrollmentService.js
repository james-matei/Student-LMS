import api from "./api";

export const enrollInCourse = (studentId, courseId) =>
    api.post(`/enrollments/${studentId}/${courseId}`);

export const unenrollFromCourse = (studentId, courseId) =>
    api.delete(`/enrollments/${studentId}/${courseId}`);

export const getMyEnrollments = (studentId) =>
    api.get(`/enrollments/student/${studentId}`);

export const updateProgress = (studentId, courseId, progress) =>
    api.put(`/enrollments/${studentId}/${courseId}/progress?progress=${progress}`);