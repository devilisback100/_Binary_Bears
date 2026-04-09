import api from "./api";

const extractList = (res) => {
    const payload = res?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

export const getGlobalLeaderboard = () =>
    api.get("/leaderboard").then(extractList);

export const getChallengeLeaderboard = (challengeId) =>
    api.get(`/leaderboard/${challengeId}`).then(extractList);