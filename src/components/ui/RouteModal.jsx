import React from "react";
import { X } from "lucide-react";

function RouteModal({ title, children, onClose }) {
    return (
        <div className="route-modal">
            <div className="route-modal__backdrop" onClick={onClose} />
            <div className="route-modal__panel card card-lg">
                <div className="route-modal__header">
                    <h3>{title}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
                        <X size={18} />
                    </button>
                </div>
                <div className="route-modal__body">{children}</div>
            </div>
        </div>
    );
}

export default RouteModal;