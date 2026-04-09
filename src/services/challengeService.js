import api from "./api";

const extractList = (res) => {
    const payload = res?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const extractItem = (res) => {
    const payload = res?.data;
    if (payload?.data) return payload.data;
    return payload;
};

export const getChallenges = (params = {}) =>
    api.get("/challenges", { params }).then(extractList);

export const getChallengeById = (id) =>
    api.get(`/challenges/${id}`).then(extractItem);

export const createChallenge = (payload) =>
    api.post("/challenges", payload).then(extractItem);