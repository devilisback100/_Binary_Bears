import api from "./api";

export const getTeamMembers = () => api.get("/team")
    .then((res) => Array.isArray(res.data) ? res.data : []);
export const createTeamMember = (payload) => api.post("/team", payload);

export const updateTeamMember = (id, payload) => api.patch(`/team/${id}`, payload);