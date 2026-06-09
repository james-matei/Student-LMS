import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});
console.log("API baseURL:", api.defaults.baseURL);
export default api;