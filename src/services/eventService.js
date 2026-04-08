import api from "./api";

export const getEvents = (params) => api.get("/events", { params })
    .then((res) => Array.isArray(res.data) ? res.data : []);

export const getEventById = (id) => api.get(`/events/${id}`);

export const createEvent = (payload) => api.post("/events", payload);

export const registerForEvent = (id) => api.post(`/events/${id}/register`);