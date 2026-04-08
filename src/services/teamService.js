import api from "./api";

export async function getTeamMembers() {
    const response = await api.get("/team");
    return response.data;
}