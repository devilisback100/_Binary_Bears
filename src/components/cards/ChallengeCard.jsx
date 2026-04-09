import React from "react";
import { FaCode, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDate";

function ChallengeCard({ challenge }) {
    return (
        <article className="card card-hoverable challenge-card">
            <div className="stack stack-4">
                <div className="cluster cluster-2">
                    <span className="badge badge-brand">
                        {challenge?.category || "Challenge"}
                    </span>
                    <span className="tag">
                        {challenge?.difficulty || "General"}
                    </span>
                </div>

                <div className="stack stack-2">
                    <h3>{challenge?.title || "Untitled challenge"}</h3>
                    <p className="text-secondary line-clamp-3">
                        {challenge?.description || "No challenge description available yet."}
                    </p>
                </div>

                <div className="stack stack-2">
                    <div className="cluster cluster-2 text-sm text-secondary">
                        <FaCode size={13} />
                        <span>{challenge?.category || "Open category"}</span>
                    </div>

                    <div className="cluster cluster-2 text-sm text-secondary">
                        <FaCalendarAlt size={13} />
                        <span>
                            Deadline: {challenge?.deadline ? formatDateTime(challenge.deadline) : "TBA"}
                        </span>
                    </div>
                </div>

                <Link
                    to={`/challenges/${challenge?.id || challenge?._id}`}
                    className="btn btn-secondary"
                >
                    View challenge <FaArrowRight size={13} />
                </Link>
            </div>
        </article>
    );
}

export default ChallengeCard;