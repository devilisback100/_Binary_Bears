import api from "./api";

export const getTeamMembers = (params = {}) => api.get("/team", { params });

export const createTeamMember = (payload) => api.post("/team", payload);

export const updateTeamMember = (id, payload) => api.patch(`/team/${id}`, payload);