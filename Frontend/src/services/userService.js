import api from "./api";

export const registerUser = (userData) => {
    return api.post("/users", userData);
};

export const loginUser = (regNO, password) => {
    return api.post("/users/login", { regNO, password });
};