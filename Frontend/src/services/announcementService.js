import axios from "axios";

const API = "http://localhost:8080/api/announcements";

export const getAllAnnouncements = () => axios.get(API);

export const createAnnouncement = (data) => axios.post(API, data);

export const deleteAnnouncementById = (id) =>
  axios.delete(`${API}/${id}`);