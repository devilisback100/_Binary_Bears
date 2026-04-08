import api from "./api";

export const getProjects = (params = {}) => api.get("/projects", { params });

export const getProjectById = (id) => api.get(`/projects/${id}`);

export const createProject = (payload) => api.post("/projects", payload);

export const updateProject = (id, payload) => api.patch(`/projects/${id}`, payload);