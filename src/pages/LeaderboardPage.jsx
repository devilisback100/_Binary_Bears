import React, { useEffect, useMemo, useState } from "react";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import LeaderboardRow from "../components/cards/LeaderboardRow";
import { getGlobalLeaderboard } from "../services/leaderboardService";
import { LEADERBOARD_FALLBACK } from "../data/leaderboardFallback";

function LeaderboardPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await getGlobalLeaderboard();

                if (Array.isArray(data) && data.length) {
                    setEntries(data);
                    setUsingFallback(false);
                } else {
                    setEntries(LEADERBOARD_FALLBACK);
                    setUsingFallback(true);
                }
            } catch (error) {
                console.error("Failed to load leaderboard", error);
                setEntries(LEADERBOARD_FALLBACK);
                setUsingFallback(true);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    const rankedEntries = useMemo(() => {
        const list = Array.isArray(entries) ? [...entries] : [];
        return list.sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0));
    }, [entries]);

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Leaderboard"
                        title="Top contributors and challenge performers"
                        subtitle="Track overall performance across challenges, submissions, and club activity."
                    />

                    {usingFallback && !loading && (
                        <div className="card">
                            <p className="text-secondary">
                                Showing demo leaderboard data for now.
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <Loader text="Loading leaderboard..." />
                    ) : rankedEntries.length ? (
                        <div className="stack stack-4">
                            {rankedEntries.map((item, index) => (
                                <LeaderboardRow
                                    key={item._id || item.id || index}
                                    item={item}
                                    rank={index + 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No leaderboard data available"
                            message="Leaderboard entries will appear here once participants start scoring."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default LeaderboardPage;