export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

export const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Team", path: "/team" },
    { label: "Events", path: "/events" },
    { label: "Projects", path: "/projects" },
];

export const EVENT_TYPES = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
];

export const TEAM_ROLE_OPTIONS = ["All", "Lead", "Core", "Member"];