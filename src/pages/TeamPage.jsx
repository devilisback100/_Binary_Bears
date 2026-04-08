// src/pages/TeamPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import TeamCard from "../components/cards/TeamCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import useAuth from "../hooks/useAuth";
import { getTeamMembers, createTeamMember } from "../services/teamService";
import { TEAM_ROLE_OPTIONS } from "../utils/constants";

function TeamPage() {
    const { user, isAuthenticated } = useAuth();
    const isUserAdmin = isAuthenticated && user?.role === "admin";

    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All");
    const [alumniOnly, setAlumniOnly] = useState(false);

    // Optional: admin create form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [memberForm, setMemberForm] = useState({
        name: "",
        role: "Member",
        domain: "Web",
        skills: [],
        batch: "",
        github: "",
        linkedin: "",
        isAlumni: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setMemberForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setMemberForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateMember = async (e) => {
        e.preventDefault();
        if (!isUserAdmin) return;

        try {
            const payload = {
                ...memberForm,
                skills: memberForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
            };
            const res = await createTeamMember(payload);
            const newMember = res?.data || res;
            setTeam((prev) => [newMember, ...prev]);
            setMemberForm({
                name: "",
                role: "Member",
                domain: "Web",
                skills: [],
                batch: "",
                github: "",
                linkedin: "",
                isAlumni: false,
            });
            setShowCreateForm(false);
        } catch (err) {
            console.error("Failed to create team member", err);
        }
    };

    const resetForm = () => {
        setMemberForm({
            name: "",
            role: "Member",
            domain: "Web",
            skills: [],
            batch: "",
            github: "",
            linkedin: "",
            isAlumni: false,
        });
        setShowCreateForm(false);
    };

    useEffect(() => {
        const loadTeam = async () => {
            setLoading(true);
            try {
                const params = {
                    ...(role !== "All" && { role }),
                    isAlumni: alumniOnly || undefined,
                    search: search || undefined,
                };
                const res = await getTeamMembers(params);
                setTeam(res?.data || []);
            } catch (error) {
                console.error("Failed to fetch team", error);
            } finally {
                setLoading(false);
            }
        };

        loadTeam();
    }, [search, role, alumniOnly]);

    const filteredTeam = useMemo(() => {
        return team.filter((member) => {
            const q = search.toLowerCase();
            const matchSearch =
                member?.name?.toLowerCase().includes(q) ||
                member?.domain?.toLowerCase().includes(q) ||
                member?.skills?.some((skill) => skill.toLowerCase().includes(q));

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

                    {isUserAdmin && (
                        <div className="card page-admin-bar">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-sm text-muted">Admin controls</h3>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowCreateForm((prev) => !prev)}
                                >
                                    {showCreateForm ? "Close" : "Add Member"}
                                </button>
                            </div>
                        </div>
                    )}

                    {isUserAdmin && showCreateForm && (
                        <div className="card page-admin-form">
                            <form onSubmit={handleCreateMember} className="grid gap-4">
                                <input
                                    className="input"
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    value={memberForm.name}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    name="role"
                                    type="text"
                                    placeholder="Role (e.g. Frontend Dev)"
                                    value={memberForm.role}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    name="domain"
                                    type="text"
                                    placeholder="Domain"
                                    value={memberForm.domain}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    className="input"
                                    name="skills"
                                    placeholder="Skills (comma-separated)"
                                    value={memberForm.skills}
                                    onChange={handleChange}
                                    rows={2}
                                />

                                <input
                                    className="input"
                                    name="batch"
                                    type="text"
                                    placeholder="Batch"
                                    value={memberForm.batch}
                                    onChange={handleChange}
                                />

                                <input
                                    className="input"
                                    name="github"
                                    type="text"
                                    placeholder="GitHub (optional)"
                                    value={memberForm.github}
                                    onChange={handleChange}
                                />

                                <input
                                    className="input"
                                    name="linkedin"
                                    type="text"
                                    placeholder="LinkedIn (optional)"
                                    value={memberForm.linkedin}
                                    onChange={handleChange}
                                />

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="isAlumni"
                                        checked={memberForm.isAlumni}
                                        onChange={handleChange}
                                    />
                                    Alumni
                                </label>

                                <div className="flex gap-3">
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Member
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

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