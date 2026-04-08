import React from "react";
import { FaGithub, FaLinkedin, FaGraduationCap } from "react-icons/fa";

function TeamCard({ member }) {
    const initials = member?.name
        ? member.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
        : "TM";

    return (
        <article className="card card-hoverable team-card">
            <div className="team-card__top">
                {member?.image ? (
                    <img src={member.image} alt={member.name} className="avatar avatar-xl team-card__image" />
                ) : (
                    <div className="avatar-initials avatar-xl">{initials}</div>
                )}

                <div className="stack stack-2">
                    <h3 className="team-card__name">{member?.name}</h3>
                    <div className="cluster cluster-2">
                        <span className="badge badge-brand">{member?.role || "Member"}</span>
                        <span className="tag">{member?.domain || "General"}</span>
                        {member?.isAlumni && (
                            <span className="badge badge-amber">
                                <FaGraduationCap size={11} /> Alumni
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="stack stack-3">
                <p className="text-sm text-secondary">Batch {member?.batch || "—"}</p>

                {member?.skills?.length ? (
                    <div className="team-card__skills">
                        {member.skills.slice(0, 5).map((skill) => (
                            <span key={skill} className="tag">{skill}</span>
                        ))}
                    </div>
                ) : null}

                <div className="cluster cluster-3 team-card__socials">
                    {member?.socials?.github && (
                        <a href={member.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                            <FaGithub size={14} /> GitHub
                        </a>
                    )}
                    {member?.socials?.linkedin && (
                        <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                            <FaLinkedin size={14} /> LinkedIn
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default TeamCard;