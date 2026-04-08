import React from "react";

function EmptyState({
    title = "Nothing here yet",
    message = "Content will appear here once data is available.",
    action = null,
}) {
    return (
        <div className="card card-lg empty-state">
            <span className="badge badge-amber">Empty state</span>
            <h3>{title}</h3>
            <p className="text-secondary">{message}</p>
            {action ? <div className="empty-state__action">{action}</div> : null}
        </div>
    );
}

export default EmptyState;