import React, { useEffect, useMemo, useState } from "react";
import EventCard from "../components/cards/EventCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import useAuth from "../hooks/useAuth";
import { getEvents, createEvent } from "../services/eventService";
import { EVENT_TYPES } from "../utils/constants";

function EventsPage() {
    const { user, isAuthenticated } = useAuth();
    const isUserAdmin = isAuthenticated && user?.role === "admin";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [type, setType] = useState("all");
    const [query, setQuery] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
        category: "",
    });

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const res = await getEvents(type !== "all" ? { type } : {});
                setEvents(res?.data || []);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [type]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const q = query.toLowerCase();
            return (
                event?.title?.toLowerCase().includes(q) ||
                event?.category?.toLowerCase().includes(q) ||
                event?.venue?.toLowerCase().includes(q)
            );
        });
    }, [events, query]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEventForm({
            title: "",
            description: "",
            date: "",
            venue: "",
            category: "",
        });
        setShowCreateForm(false);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        if (!isUserAdmin) return;

        setSubmitting(true);
        try {
            const payload = {
                ...eventForm,
                date: eventForm.date ? new Date(eventForm.date).toISOString() : "",
            };

            const res = await createEvent(payload);
            const newEvent = res?.data || res;

            setEvents((prev) => [newEvent, ...prev]);
            resetForm();
        } catch (error) {
            console.error("Failed to create event", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Events"
                        title="Explore the club calendar"
                        subtitle="Upcoming sessions, workshops, showcases, and archived events — all in one place."
                    />

                    {isUserAdmin && (
                        <div className="card page-admin-bar">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg weight-semibold">Admin controls</h3>
                                    <p className="text-sm text-muted">
                                        Create new events using the locked backend schema.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowCreateForm((prev) => !prev)}
                                >
                                    {showCreateForm ? "Close" : "Create Event"}
                                </button>
                            </div>
                        </div>
                    )}

                    {isUserAdmin && showCreateForm && (
                        <div className="card page-admin-form">
                            <form onSubmit={handleCreateEvent} className="grid gap-4">
                                <input
                                    className="input"
                                    name="title"
                                    type="text"
                                    placeholder="Event title"
                                    value={eventForm.title}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    className="input"
                                    name="description"
                                    placeholder="Event description"
                                    value={eventForm.description}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                />

                                <input
                                    className="input"
                                    name="date"
                                    type="datetime-local"
                                    value={eventForm.date}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    name="venue"
                                    type="text"
                                    placeholder="Venue"
                                    value={eventForm.venue}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    className="input"
                                    name="category"
                                    type="text"
                                    placeholder="Category"
                                    value={eventForm.category}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? "Creating..." : "Create Event"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="card page-filter-bar">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search events by title, category, or venue"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <div className="page-filter-tabs">
                            {EVENT_TYPES.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`tag ${type === item.value ? "active" : ""}`}
                                    onClick={() => setType(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <Loader text="Loading events..." />
                    ) : filteredEvents.length ? (
                        <div className="grid grid-3 page-grid">
                            {filteredEvents.map((event) => (
                                <EventCard key={event._id || event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No events found"
                            message="Try changing your search or event type."
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default EventsPage;