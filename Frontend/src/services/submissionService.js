import api from "./api";

export const submitAssignment = (studentId, assignmentId, file) => {
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);
    return api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const gradeSubmission = (submissionId, grade) =>
    api.put(`/submissions/${submissionId}/grade?grade=${grade}`);

export const getSubmissionsByAssignment = (assignmentId) =>
    api.get(`/submissions/assignment/${assignmentId}`);

export const getMySubmissions = (studentId) =>
    api.get(`/submissions/student/${studentId}`);

export const getSubmissionsByCourse = (courseId) =>
    api.get(`/submissions/course/${courseId}`);