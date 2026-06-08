import api from "./api";

export const getAllCourses = () => {
  return api.get("/courses");
};

export const createCourse = (course) => {
  return api.post("/courses", course);
};

export const deleteCourseById = (id) => {
  return api.delete(`/courses/${id}`);
};