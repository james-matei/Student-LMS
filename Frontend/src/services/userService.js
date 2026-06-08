import api from "./api";

export const registerUser = (userData) => {
    return api.post("/users", userData);
};

export const loginUser = (regNO, password) => {
    return api.post("/users/login", { regNO, password });
};
 //Admin creates any type of user
export const createUser = (userData) => {
return api.post("/users", userData);
};
export const createTeacher = (userData) => {
    return api.post("/users/create-teacher", userData);
};

export const createAdmin = (userData) => {
    return api.post("/users/create-admin", userData);
};
export const getAllUsers = () => {
    return api.get("/users");
};

export const suspendUser = (id) => {
    return api.put(`/users/${id}/suspend`);
};

export const restoreUser = (id) => {
    return api.put(`/users/${id}/restore`);
};

export const deleteUserById = (id) => {
    return api.delete(`/users/${id}`);
};