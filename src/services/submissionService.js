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

export const getSubmissions = (challengeId) =>
    api.get(`/challenges/${challengeId}/submissions`).then(extractList);

export const submitChallenge = (challengeId, payload) =>
    api.post(`/challenges/${challengeId}/submissions`, payload).then(extractItem);