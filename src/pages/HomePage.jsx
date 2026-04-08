import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CalendarRange, FolderKanban, ArrowRight } from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import TeamCard from "../components/cards/TeamCard";
import EventCard from "../components/cards/EventCard";
import ProjectCard from "../components/cards/ProjectCard";
import { getTeamMembers } from "../services/teamService";
import { getEvents } from "../services/eventService";
import { getProjects } from "../services/projectService";

function HomePage() {
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState([]);
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const loadHome = async () => {
            try {
                const [teamRes, eventRes, projectRes] = await Promise.all([
                    getTeamMembers(),
                    getEvents({ type: "upcoming" }),
                    getProjects(),
                ]);

                setTeam(teamRes?.data || []);
                setEvents(eventRes?.data || []);
                setProjects(projectRes?.data || []);
            } catch (error) {
                console.error("Failed to load homepage data", error);
            } finally {
                setLoading(false);
            }
        };

        loadHome();
    }, []);

    const stats = [
        { label: "Team Members", value: team.length, icon: <Users size={20} /> },
        { label: "Events", value: events.length, icon: <CalendarRange size={20} /> },
        { label: "Projects", value: projects.length, icon: <FolderKanban size={20} /> },
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="container hero-section__grid">
                    <div className="stack stack-6">
                        <span className="badge badge-brand">Club Platform</span>
                        <div className="stack stack-4">
                            <h1 className="hero-title">
                                Build, collaborate, and showcase what your club creates.
                            </h1>
                            <p className="hero-copy text-secondary">
                                A modern digital home for your team, events, and student projects —
                                designed for both mobile-first browsing and polished desktop exploration.
                            </p>
                        </div>

                        <div className="cluster cluster-4">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Join the club
                            </Link>
                            <Link to="/events" className="btn btn-secondary btn-lg">
                                Explore events
                            </Link>
                        </div>
                    </div>

                    <div className="hero-panel card card-lg surface-dark">
                        <div className="grid hero-stats-grid">
                            {stats.map((item) => (
                                <div key={item.label} className="stat-card stat-card-dark">
                                    <div className="cluster cluster-2 text-brand">{item.icon}</div>
                                    <div className="stat-value">{item.value}</div>
                                    <div className="stat-label">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow="About"
                        title="One platform for club identity and momentum."
                        subtitle="Phase 1 focuses on a clean public experience: homepage, team directory, events listing, projects showcase, and working authentication."
                    />

                    <div className="grid grid-3 home-info-grid">
                        <article className="card card-hoverable">
                            <span className="badge badge-brand">Team</span>
                            <h3>Discover the people behind the club</h3>
                            <p className="text-secondary">
                                Browse members by role, domain, skills, and alumni status.
                            </p>
                        </article>

                        <article className="card card-hoverable">
                            <span className="badge badge-amber">Events</span>
                            <h3>See what’s upcoming and what already happened</h3>
                            <p className="text-secondary">
                                Explore club activities with clean event detail pages and future-ready registration.
                            </p>
                        </article>

                        <article className="card card-hoverable">
                            <span className="badge badge-olive">Projects</span>
                            <h3>Showcase technical work in one place</h3>
                            <p className="text-secondary">
                                Highlight project outcomes, stacks, team contribution, and live links.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow="Featured team"
                        title="People building the community"
                        subtitle="A quick look at some team members and contributors."
                    />

                    {loading ? (
                        <Loader text="Loading featured team..." />
                    ) : team.length ? (
                        <div className="grid grid-3">
                            {team.slice(0, 3).map((member) => (
                                <TeamCard key={member._id || member.id} member={member} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No team members yet" />
                    )}

                    <div className="section-cta">
                        <Link to="/team" className="btn btn-secondary">
                            View all team
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section surface-sunken">
                <div className="container">
                    <SectionTitle
                        eyebrow="Upcoming events"
                        title="Stay in sync with the club calendar"
                        subtitle="Discover hackathons, workshops, sessions, and meetups."
                    />

                    {loading ? (
                        <Loader text="Loading events..." />
                    ) : events.length ? (
                        <div className="grid grid-3">
                            {events.slice(0, 3).map((event) => (
                                <EventCard key={event._id || event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No events listed yet" />
                    )}

                    <div className="section-cta">
                        <Link to="/events" className="btn btn-secondary">
                            View all events
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow="Projects"
                        title="What the club is shipping"
                        subtitle="A curated preview of student work, experiments, and collaborations."
                    />

                    {loading ? (
                        <Loader text="Loading projects..." />
                    ) : projects.length ? (
                        <div className="grid grid-3">
                            {projects.slice(0, 3).map((project) => (
                                <ProjectCard key={project._id || project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No projects available yet" />
                    )}

                    <div className="section-cta">
                        <Link to="/projects" className="btn btn-secondary">
                            Explore projects
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;