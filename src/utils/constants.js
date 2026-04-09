export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

export const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Team", path: "/team" },
    { label: "Events", path: "/events" },
    { label: "Projects", path: "/projects" },
    { label: "Challenges", path: "/challenges" },
    { label: "Leaderboard", path: "/leaderboard" },
];

export const EVENT_TYPES = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
];

export const TEAM_ROLE_OPTIONS = ["All", "Lead", "Core", "Member"];

export const CHALLENGE_DIFFICULTY_OPTIONS = [
    { label: "All", value: "" },
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
];

export const LEADERBOARD_TYPES = [
    { label: "Global", value: "global" },
    { label: "Challenge", value: "challenge" },
];