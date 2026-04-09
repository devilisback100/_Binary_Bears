import React from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

function SubmissionCard({ submission }) {
    return (
        <article className="card card-hoverable submission-card">
            <div className="stack stack-4">
                <div className="cluster cluster-2">
                    <span className="badge badge-olive">Submission</span>
                    {submission?.score !== undefined && submission?.score !== null && (
                        <span className="tag">Score: {submission.score}</span>
                    )}
                </div>

                <div className="stack stack-2">
                    <h3>{submission?.user?.name || "Participant"}</h3>
                    <p className="text-secondary">
                        {submission?.remarks || "No remarks added yet."}
                    </p>
                </div>

                <div className="cluster cluster-3">
                    {submission?.githubLink && (
                        <a
                            href={submission.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            <FaGithub size={13} />
                            GitHub
                        </a>
                    )}

                    {submission?.liveLink && (
                        <a
                            href={submission.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            <FaExternalLinkAlt size={13} />
                            Live demo
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default SubmissionCard;