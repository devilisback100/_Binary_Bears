import api from "./api";

export async function getEvents(params = {}) {
    const response = await api.get("/events", { params });
    return response.data;
}

export async function getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
}

export async function registerForEvent(id) {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
}