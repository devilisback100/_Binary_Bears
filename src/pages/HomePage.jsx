import React, { useEffect, useRef, useState } from "react";
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
import "./HomePage.css";

const asArray = (x) => (Array.isArray(x) ? x : []);

const SHAPES = ["square", "triangle", "circle"];
const COLORS = ["#c9a84c", "#9b72e8", "#4a2fa0"];

function useBouncingShape(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let W = canvas.offsetWidth;
        let H = canvas.offsetHeight;
        canvas.width = W;
        canvas.height = H;

        const size = 38;
        let x = W / 2;
        let y = H / 2;
        let vx = 2.2;
        let vy = 1.6;
        let shapeIndex = 0;
        let colorIndex = 0;
        let raf;

        const drawSquare = (cx, cy, s, color) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.7;
            ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = color;
            ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
            ctx.restore();
        };

        const drawTriangle = (cx, cy, s, color) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.moveTo(cx, cy - s / 1.6);
            ctx.lineTo(cx + s / 1.8, cy + s / 2.5);
            ctx.lineTo(cx - s / 1.8, cy + s / 2.5);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const drawCircle = (cx, cy, s, color) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const drawers = [drawSquare, drawTriangle, drawCircle];

        const tick = () => {
            ctx.clearRect(0, 0, W, H);

            let bounced = false;

            if (x + size / 2 >= W) { x = W - size / 2; vx = -Math.abs(vx); bounced = true; }
            if (x - size / 2 <= 0) { x = size / 2; vx = Math.abs(vx); bounced = true; }
            if (y + size / 2 >= H) { y = H - size / 2; vy = -Math.abs(vy); bounced = true; }
            if (y - size / 2 <= 0) { y = size / 2; vy = Math.abs(vy); bounced = true; }

            if (bounced) {
                shapeIndex = (shapeIndex + 1) % SHAPES.length;
                colorIndex = (colorIndex + 1) % COLORS.length;
            }

            drawers[shapeIndex](x, y, size, COLORS[colorIndex]);

            x += vx;
            y += vy;

            raf = requestAnimationFrame(tick);
        };

        tick();

        const onResize = () => {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W;
            canvas.height = H;
        };

        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [canvasRef]);
}

function useScrollReveal() {
    useEffect(() => {
        const els = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.12 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

function HomePage() {
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState([]);
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const canvasRef = useRef(null);

    useBouncingShape(canvasRef);
    useScrollReveal();

    useEffect(() => {
        const loadHome = async () => {
            setLoading(true);
            try {
                const [teamRes, eventRes, projectRes] = await Promise.all([
                    getTeamMembers(),
                    getEvents({ type: "upcoming" }),
                    getProjects(),
                ]);
                setTeam(asArray(teamRes));
                setEvents(asArray(eventRes));
                setProjects(asArray(projectRes));
            } catch (error) {
                console.error("Failed to load homepage data", error);
            } finally {
                setLoading(false);
            }
        };
        loadHome();
    }, []);

    const stats = [
        { label: "Team Members", value: asArray(team).length, icon: <Users size={18} /> },
        { label: "Events", value: asArray(events).length, icon: <CalendarRange size={18} /> },
        { label: "Projects", value: asArray(projects).length, icon: <FolderKanban size={18} /> },
    ];

    return (
        <div className="home-page">

            {/* ── Hero ── */}
            <section className="hero-section">
                <canvas ref={canvasRef} className="hero-canvas" />

                <div className="container hero-section__grid">
                    <div className="stack stack-6">
                        <span className="badge badge-brand hero-badge-anim">Club Platform</span>

                        <div className="stack stack-4">
                            <h1 className="hero-title">
                                Build, collaborate, and showcase what your club creates.
                            </h1>
                            <p className="hero-copy text-secondary">
                                A modern digital home for your team, events, and student projects —
                                designed for both mobile‑first browsing and polished desktop exploration.
                            </p>
                        </div>

                        <div className="cluster cluster-4 hero-btns-anim">
                            <Link to="/signup" className="btn btn-primary btn-lg">Join the club</Link>
                            <Link to="/events" className="btn btn-secondary btn-lg">Explore events</Link>
                        </div>
                    </div>

                    <div className="hero-panel card card-lg surface-dark">
                        <div className="hero-stats-grid grid">
                            {stats.map((item) => (
                                <div key={item.label} className="stat-card-dark">
                                    <div className="cluster cluster-2 text-brand">{item.icon}</div>
                                    <div className="stat-value">{item.value}</div>
                                    <div className="stat-label">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About ── */}
            <section className="section">
                <div className="container">
                    <div className="reveal">
                        <SectionTitle
                            eyebrow="About"
                            title="One platform for club identity and momentum."
                            subtitle="Phase 1 focuses on a clean public experience: homepage, team directory, events listing, projects showcase, and working authentication."
                        />
                    </div>

                    <div className="grid grid-3 home-info-grid">
                        {[
                            { badge: "badge-brand", label: "Team", title: "Discover the people behind the club", body: "Browse members by role, domain, skills, and alumni status.", delay: "reveal-delay-1" },
                            { badge: "badge-amber", label: "Events", title: "See what's upcoming and what already happened", body: "Explore club activities with clean event detail pages and future‑ready registration.", delay: "reveal-delay-2" },
                            { badge: "badge-olive", label: "Projects", title: "Showcase technical work in one place", body: "Highlight project outcomes, stacks, team contribution, and live links.", delay: "reveal-delay-3" },
                        ].map((card) => (
                            <article key={card.label} className={`card card-hoverable reveal ${card.delay}`}>
                                <span className={`badge ${card.badge}`}>{card.label}</span>
                                <h3>{card.title}</h3>
                                <p className="text-secondary">{card.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured team ── */}
            <section className="section surface-sunken">
                <div className="container">
                    <div className="reveal">
                        <SectionTitle
                            eyebrow="Featured team"
                            title="People building the community"
                            subtitle="A quick look at some team members and contributors."
                        />
                    </div>

                    {loading ? (
                        <Loader text="Loading featured team..." />
                    ) : asArray(team).length ? (
                        <div className="grid grid-3">
                            {asArray(team).slice(0, 3).map((member, i) => (
                                <div key={member._id || member.id} className={`reveal reveal-delay-${i + 1}`}>
                                    <TeamCard member={member} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No team members yet" />
                    )}

                    <div className="section-cta reveal">
                        <Link to="/team" className="btn btn-secondary">
                            View all team <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Upcoming events ── */}
            <section className="section">
                <div className="container">
                    <div className="reveal">
                        <SectionTitle
                            eyebrow="Upcoming events"
                            title="Stay in sync with the club calendar"
                            subtitle="Discover hackathons, workshops, sessions, and meetups."
                        />
                    </div>

                    {loading ? (
                        <Loader text="Loading events..." />
                    ) : asArray(events).length ? (
                        <div className="grid grid-3">
                            {asArray(events).slice(0, 3).map((event, i) => (
                                <div key={event._id || event.id} className={`reveal reveal-delay-${i + 1}`}>
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No events listed yet" />
                    )}

                    <div className="section-cta reveal">
                        <Link to="/events" className="btn btn-secondary">
                            View all events <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Projects ── */}
            <section className="section surface-sunken">
                <div className="container">
                    <div className="reveal">
                        <SectionTitle
                            eyebrow="Projects"
                            title="What the club is shipping"
                            subtitle="A curated preview of student work, experiments, and collaborations."
                        />
                    </div>

                    {loading ? (
                        <Loader text="Loading projects..." />
                    ) : asArray(projects).length ? (
                        <div className="grid grid-3">
                            {asArray(projects).slice(0, 3).map((project, i) => (
                                <div key={project._id || project.id} className={`reveal reveal-delay-${i + 1}`}>
                                    <ProjectCard project={project} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No projects available yet" />
                    )}

                    <div className="section-cta reveal">
                        <Link to="/projects" className="btn btn-secondary">
                            Explore projects <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default HomePage;