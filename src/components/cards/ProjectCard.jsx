import React from "react";
import { FaArrowUp, FaGithub, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
    return (
        <article className="card card-hoverable project-card">
            <div className="stack stack-4">
                {/* Badge + Likes */}
                <div className="cluster cluster-2">
                    {project?.featured ? (
                        <span className="badge badge-brand">Featured</span>
                    ) : (
                        <span className="badge badge-olive">Project</span>
                    )}
                    <span className="tag">
                        <FaHeart size={12} />
                        {project?.likes || 0}
                    </span>
                </div>

                {/* Title + Description */}
                <div className="stack stack-2">
                    <h3>{project?.title}</h3>
                    <p className="text-secondary">
                        {project?.description || "No project description available yet."}
                    </p>
                </div>

                {/* Tech Stack */}
                {project?.techStack?.length ? (
                    <div className="cluster cluster-2">
                        {project.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="tag">
                                {tech}
                            </span>
                        ))}
                    </div>
                ) : null}

                {/* Actions */}
                <div className="project-card__actions">
                    <Link
                        to={`/projects/${project?.id || project?._id}`}
                        className="btn btn-secondary"
                    >
                        Open
                        <FaArrowUp size={16} />
                    </Link>

                    {project?.github ? (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                        >
                            <FaGithub size={16} />
                            GitHub
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;
