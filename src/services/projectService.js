import api from "./api";

export async function getProjects() {
    const response = await api.get("/projects");
    return response.data;
}

export async function getProjectById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
}