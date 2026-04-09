import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import SubmissionCard from "../components/cards/SubmissionCard";
import { getChallengeById } from "../services/challengeService";
import { getSubmissions, submitChallenge } from "../services/submissionService";
import { formatDateTime } from "../utils/formatDate";

function ChallengeDetailsPage() {
    const { id } = useParams();

    const [challenge, setChallenge] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        githubLink: "",
        liveLink: "",
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [challengeData, submissionsData] = await Promise.all([
                    getChallengeById(id),
                    getSubmissions(id),
                ]);

                setChallenge(challengeData || null);
                setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
            } catch (error) {
                console.error("Failed to load challenge details", error);
                setChallenge(null);
                setSubmissions([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const created = await submitChallenge(id, form);
            if (created) {
                setSubmissions((prev) => [created, ...prev]);
            }

            setForm({
                githubLink: "",
                liveLink: "",
            });
        } catch (error) {
            console.error("Failed to submit challenge", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-shell">
                <section className="section">
                    <div className="container">
                        <Loader text="Loading challenge details..." />
                    </div>
                </section>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="page-shell">
                <section className="section">
                    <div className="container">
                        <EmptyState
                            title="Challenge not found"
                            message="The requested challenge could not be loaded."
                        />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow={challenge?.category || "Challenge"}
                        title={challenge?.title || "Challenge details"}
                        subtitle={challenge?.description || "No description available."}
                    />

                    <div className="grid grid-2 page-detail-grid">
                        <article className="card">
                            <div className="stack stack-3">
                                <span className="badge badge-brand">
                                    {challenge?.difficulty || "General"}
                                </span>
                                <p className="text-secondary">
                                    Deadline: {challenge?.deadline ? formatDateTime(challenge.deadline) : "TBA"}
                                </p>
                            </div>
                        </article>

                        <article className="card">
                            <form onSubmit={handleSubmit} className="stack stack-4">
                                <h3>Submit your work</h3>

                                <input
                                    className="input"
                                    type="url"
                                    name="githubLink"
                                    placeholder="GitHub repository link"
                                    value={form.githubLink}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    type="url"
                                    name="liveLink"
                                    placeholder="Live project link (optional)"
                                    value={form.liveLink}
                                    onChange={handleChange}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit challenge"}
                                </button>
                            </form>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow="Submissions"
                        title="Recent entries"
                        subtitle="See what participants have submitted for this challenge."
                    />

                    {submissions.length ? (
                        <div className="grid grid-3 page-grid">
                            {submissions.map((submission) => (
                                <SubmissionCard
                                    key={submission._id || submission.id}
                                    submission={submission}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No submissions yet"
                            message="Be the first to submit to this challenge."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default ChallengeDetailsPage;