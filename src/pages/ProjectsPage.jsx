// src/pages/ProjectsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import useAuth from "../hooks/useAuth";
import { getProjects, createProject } from "../services/projectService";

function ProjectsPage() {
    const { user, isAuthenticated } = useAuth();
    const isUserAdmin = isAuthenticated && user?.role === "admin";

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [projectForm, setProjectForm] = useState({
        title: "",
        description: "",
        techStack: [],
        github: "",
        live: "",
        featured: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setProjectForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setProjectForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!isUserAdmin) return;

        try {
            const payload = {
                ...projectForm,
                techStack: projectForm.techStack.split(",").map((t) => t.trim()).filter(Boolean),
            };
            const res = await createProject(payload);
            const newProject = res?.data || res;
            setProjects((prev) => [newProject, ...prev]);
            setProjectForm({
                title: "",
                description: "",
                techStack: [],
                github: "",
                live: "",
                featured: false,
            });
            setShowCreateForm(false);
        } catch (err) {
            console.error("Failed to create project", err);
        }
    };

    const resetForm = () => {
        setProjectForm({
            title: "",
            description: "",
            techStack: [],
            github: "",
            live: "",
            featured: false,
        });
        setShowCreateForm(false);
    };

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                const params = {
                    featured: featuredOnly || undefined,
                    search: query || undefined,
                };
                const res = await getProjects(params);
                setProjects(res?.data || []);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [query, featuredOnly]);

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

                    {isUserAdmin && (
                        <div className="card page-admin-bar">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-sm text-muted">Admin controls</h3>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowCreateForm((prev) => !prev)}
                                >
                                    {showCreateForm ? "Close" : "Add Project"}
                                </button>
                            </div>
                        </div>
                    )}

                    {isUserAdmin && showCreateForm && (
                        <div className="card page-admin-form">
                            <form onSubmit={handleCreateProject} className="grid gap-4">
                                <input
                                    className="input"
                                    name="title"
                                    type="text"
                                    placeholder="Project title"
                                    value={projectForm.title}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    className="input"
                                    name="description"
                                    placeholder="Project description"
                                    value={projectForm.description}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                />

                                <input
                                    className="input"
                                    name="techStack"
                                    type="text"
                                    placeholder="Tech stack (comma‑separated: React, Node.js, ...)"
                                    value={projectForm.techStack}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    name="github"
                                    type="text"
                                    placeholder="GitHub link (optional)"
                                    value={projectForm.github}
                                    onChange={handleChange}
                                />

                                <input
                                    className="input"
                                    name="live"
                                    type="text"
                                    placeholder="Live link (optional)"
                                    value={projectForm.live}
                                    onChange={handleChange}
                                />

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={projectForm.featured}
                                        onChange={handleChange}
                                    />
                                    Featured
                                </label>

                                <div className="flex gap-3">
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

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