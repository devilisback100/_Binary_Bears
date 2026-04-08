import React, { useEffect, useMemo, useState } from "react";
import TeamCard from "../components/cards/TeamCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getTeamMembers } from "../services/teamService";
import { TEAM_ROLE_OPTIONS } from "../utils/constants";

function TeamPage() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All");
    const [alumniOnly, setAlumniOnly] = useState(false);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const res = await getTeamMembers();
                setTeam(res?.data || []);
            } catch (error) {
                console.error("Failed to fetch team", error);
            } finally {
                setLoading(false);
            }
        };

        loadTeam();
    }, []);

    const filteredTeam = useMemo(() => {
        return team.filter((member) => {
            const matchSearch =
                member?.name?.toLowerCase().includes(search.toLowerCase()) ||
                member?.domain?.toLowerCase().includes(search.toLowerCase()) ||
                member?.skills?.some((skill) =>
                    skill.toLowerCase().includes(search.toLowerCase())
                );

            const matchRole = role === "All" ? true : member?.role === role;
            const matchAlumni = alumniOnly ? member?.isAlumni : true;

            return matchSearch && matchRole && matchAlumni;
        });
    }, [team, search, role, alumniOnly]);

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Team directory"
                        title="Meet the people behind the club"
                        subtitle="Filter by role, search by skills, and explore the members shaping the community."
                    />

                    <div className="card page-filter-bar">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search by name, domain, or skill"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            {TEAM_ROLE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={alumniOnly}
                                onChange={(e) => setAlumniOnly(e.target.checked)}
                            />
                            Alumni only
                        </label>
                    </div>

                    {loading ? (
                        <Loader text="Loading team members..." />
                    ) : filteredTeam.length ? (
                        <div className="grid grid-3 page-grid">
                            {filteredTeam.map((member) => (
                                <TeamCard key={member._id || member.id} member={member} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No matching team members"
                            message="Try changing your search or filters."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default TeamPage;