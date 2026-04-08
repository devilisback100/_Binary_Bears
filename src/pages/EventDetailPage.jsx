import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, Users, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getEventById, registerForEvent } from "../services/eventService";
import { formatDateTime } from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function EventDetailPage() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const res = await getEventById(id);
                setEvent(res?.data || null);
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    const handleRegister = async () => {
        try {
            setRegistering(true);
            setMessage("");
            const res = await registerForEvent(id);
            setMessage(res?.message || "Registered successfully.");
        } catch (error) {
            setMessage(
                error?.response?.data?.error ||
                "Registration failed. Please try again."
            );
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return <Loader text="Loading event details..." />;
    }

    if (!event) {
        return <EmptyState title="Event not found" message="The event may have been removed." />;
    }

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container container-md">
                    <div className="detail-back">
                        <Link to="/events" className="btn btn-ghost">
                            <ArrowLeft size={16} />
                            Back to events
                        </Link>
                    </div>

                    <article className="card card-lg detail-card">
                        {event?.banner ? (
                            <img src={event.banner} alt={event.title} className="detail-banner" />
                        ) : null}

                        <div className="stack stack-5">
                            <div className="cluster cluster-2">
                                <span className="badge badge-brand">{event.category}</span>
                                <span className="tag">
                                    <Users size={12} />
                                    {event.registeredCount || 0} registered
                                </span>
                            </div>

                            <div className="stack stack-3">
                                <h1 className="detail-title">{event.title}</h1>
                                <p className="text-secondary detail-copy">
                                    {event.description}
                                </p>
                            </div>

                            <div className="detail-meta">
                                <div className="cluster cluster-2 text-secondary">
                                    <CalendarDays size={18} />
                                    <span>{formatDateTime(event.date)}</span>
                                </div>
                                <div className="cluster cluster-2 text-secondary">
                                    <MapPin size={18} />
                                    <span>{event.venue || "Venue TBA"}</span>
                                </div>
                            </div>

                            {message ? (
                                <div className="alert alert-info">{message}</div>
                            ) : null}

                            {isAuthenticated ? (
                                <button
                                    className="btn btn-primary btn-lg detail-action"
                                    onClick={handleRegister}
                                    disabled={registering}
                                >
                                    {registering ? "Registering..." : "Register for event"}
                                </button>
                            ) : (
                                <Link to="/login" className="btn btn-primary btn-lg detail-action">
                                    Login to register
                                </Link>
                            )}
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default EventDetailPage;