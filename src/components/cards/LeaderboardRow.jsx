import React from "react";

function LeaderboardRow({ item, rank }) {
    return (
        <article className="card leaderboard-row">
            <div className="leaderboard-row__grid">
                <div className="leaderboard-rank">
                    <span className="badge badge-brand">#{rank}</span>
                </div>

                <div className="stack stack-1">
                    <h3>{item?.name || item?.user?.name || "Participant"}</h3>
                    <p className="text-secondary">
                        {item?.role || item?.user?.role || "Member"}
                    </p>
                </div>

                <div className="stack stack-1 leaderboard-metric">
                    <strong>{item?.score ?? 0}</strong>
                    <span className="text-secondary text-sm">Score</span>
                </div>

                <div className="stack stack-1 leaderboard-metric">
                    <strong>{item?.solved ?? item?.completedChallenges ?? 0}</strong>
                    <span className="text-secondary text-sm">Solved</span>
                </div>

                <div className="stack stack-1 leaderboard-metric">
                    <strong>{item?.streak ?? 0}</strong>
                    <span className="text-secondary text-sm">Streak</span>
                </div>
            </div>
        </article>
    );
}

export default LeaderboardRow;