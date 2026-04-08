import api from "./api";

export const getTeamMembers = (params = {}) => api.get("/team", { params });