
import api from "./api";

export const getLessonsByCourse = (courseId) => {
  return api.get(`/lessons/course/${courseId}`);
};

export const createLesson = (formData) => {
  return api.post("/lessons", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteLessonById = (id) => {
  return api.delete(`/lessons/${id}`);
};