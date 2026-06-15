import api from "./api";

export const getAllCourses = () => {
  return api.get("/courses");
};

export const createCourse = async (course) => {
  console.log("createCourse called with:", course);  // add
  try {
    const result = await api.post("/courses", course);
    console.log("api.post succeeded:", result.data);  // add
    return result;
  } catch (err) {
    console.error("api.post error message:", err.message);  // add
    console.error("api.post error code:", err.code);        // add
    console.error("api.post full error:", err);             // add
    throw err;
  }
};

export const deleteCourseById = (id) => {
  return api.delete(`/courses/${id}`);
};
export const togglePublishCourse = (id) => {
  return api.put(`/courses/${id}/toggle`);
};
export const getCoursesByLecturer = (lecturerId) =>
    axios.get(`${API_URL}/lecturer/${lecturerId}`);