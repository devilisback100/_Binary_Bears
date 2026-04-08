import api from "./api";

export const getEvents = (params = {}) => api.get("/events", { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const registerForEvent = (id) => api.post(`/events/${id}/register`);