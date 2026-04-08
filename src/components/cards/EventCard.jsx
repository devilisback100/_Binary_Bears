import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDate";

function EventCard({ event }) {
    return (
        <article className="card card-hoverable event-card">
            {event?.banner ? (
                <div className="event-card__banner-wrap">
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="event-card__banner"
                    />
                </div>
            ) : null}

            <div className="stack stack-4">
                <div className="cluster cluster-2">
                    <span className="badge badge-brand">{event?.category || "Event"}</span>
                    <span className="tag">{event?.registeredCount || 0} joined</span>
                </div>

                <div className="stack stack-2">
                    <h3>{event?.title}</h3>
                    <p className="text-secondary line-clamp-3">
                        {event?.description || "No event description available yet."}
                    </p>
                </div>

                <div className="stack stack-2">
                    <div className="cluster cluster-2 text-sm text-secondary">
                        <FaCalendarAlt size={16} />
                        <span>{formatDateTime(event?.date)}</span>
                    </div>
                    <div className="cluster cluster-2 text-sm text-secondary">
                        <FaMapMarkerAlt size={16} />
                        <span>{event?.venue || "Venue TBA"}</span>
                    </div>
                </div>

                <Link to={`/events/${event?.id || event?._id}`} className="btn btn-secondary">
                    View details
                    <FaArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}

export default EventCard;
