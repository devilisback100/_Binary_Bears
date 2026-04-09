import React, { useEffect, useMemo, useState } from "react";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import ChallengeCard from "../components/cards/ChallengeCard";
import { getChallenges } from "../services/challengeService";

function ChallengesPage() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState("");
    const [category, setCategory] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loadChallenges = async () => {
            setLoading(true);
            try {
                const params = {
                    difficulty: difficulty || undefined,
                    category: category || undefined,
                };
                const data = await getChallenges(params);
                setChallenges(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch challenges", error);
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        };

        loadChallenges();
    }, [difficulty, category]);

    const filteredChallenges = useMemo(() => {
        const list = Array.isArray(challenges) ? challenges : [];
        const q = query.toLowerCase();

        return list.filter((challenge) => {
            if (!q) return true;
            return (
                challenge?.title?.toLowerCase().includes(q) ||
                challenge?.description?.toLowerCase().includes(q) ||
                challenge?.category?.toLowerCase().includes(q) ||
                challenge?.difficulty?.toLowerCase().includes(q)
            );
        });
    }, [challenges, query]);

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Challenges"
                        title="Build, submit, and compete"
                        subtitle="Explore active challenges by difficulty and category, then submit your best work."
                    />

                    <div className="card page-filter-bar">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search challenges"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <select
                            className="input"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">All difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <input
                            className="input"
                            type="text"
                            placeholder="Filter by category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <Loader text="Loading challenges..." />
                    ) : filteredChallenges.length ? (
                        <div className="grid grid-3 page-grid">
                            {filteredChallenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge._id || challenge.id}
                                    challenge={challenge}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No challenges found"
                            message="Try changing the filters or check back later."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default ChallengesPage;