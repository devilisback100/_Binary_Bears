import React, { useEffect, useMemo, useState } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getProjects } from "../services/projectService";

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res?.data || []);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const q = query.toLowerCase();
            const searchMatch =
                project?.title?.toLowerCase().includes(q) ||
                project?.description?.toLowerCase().includes(q) ||
                project?.techStack?.some((tech) => tech.toLowerCase().includes(q));

            const featuredMatch = featuredOnly ? project?.featured : true;

            return searchMatch && featuredMatch;
        });
    }, [projects, query, featuredOnly]);

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Projects gallery"
                        title="Browse work the club has built"
                        subtitle="A polished gallery of experiments, products, and collaborative student projects."
                    />

                    <div className="card page-filter-bar">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search by title, description, or tech"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={featuredOnly}
                                onChange={(e) => setFeaturedOnly(e.target.checked)}
                            />
                            Featured only
                        </label>
                    </div>

                    {loading ? (
                        <Loader text="Loading projects..." />
                    ) : filteredProjects.length ? (
                        <div className="grid grid-3 page-grid">
                            {filteredProjects.map((project) => (
                                <ProjectCard key={project._id || project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No matching projects"
                            message="Try another keyword or disable the featured-only filter."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default ProjectsPage;