import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getProjectById } from "../services/projectService";

function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const res = await getProjectById(id);
                setProject(res?.data || null);
            } catch (error) {
                console.error("Failed to fetch project", error);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    if (loading) {
        return <Loader text="Loading project details..." />;
    }

    if (!project) {
        return (
            <EmptyState
                title="Project not found"
                message="The project may have been removed."
            />
        );
    }

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container container-md">
                    <div className="detail-back">
                        <Link to="/projects" className="btn btn-ghost">
                            <FaArrowLeft size={16} />
                            Back to projects
                        </Link>
                    </div>

                    <article className="card card-lg detail-card">
                        <div className="stack stack-5">
                            <div className="cluster cluster-2">
                                {project?.featured ? (
                                    <span className="badge badge-brand">Featured</span>
                                ) : (
                                    <span className="badge badge-olive">Project</span>
                                )}
                                <span className="tag">
                                    <FaHeart size={12} />
                                    {project?.likes || 0} likes
                                </span>
                            </div>

                            <div className="stack stack-3">
                                <h1 className="detail-title">{project.title}</h1>
                                <p className="text-secondary detail-copy">
                                    {project.description}
                                </p>
                            </div>

                            {project?.techStack?.length ? (
                                <div className="cluster cluster-2">
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className="tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            <div className="project-detail__links">
                                {project?.github ? (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-secondary"
                                    >
                                        <FaGithub size={16} />
                                        GitHub
                                    </a>
                                ) : null}

                                {project?.live ? (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary"
                                    >
                                        <FaExternalLinkAlt size={16} />
                                        Live demo
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default ProjectDetailPage;