import React, { useEffect, useMemo, useState } from "react";
import EventCard from "../components/cards/EventCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getEvents } from "../services/eventService";
import { EVENT_TYPES } from "../utils/constants";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("all");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loadEvents = async () => {
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

    return (
        <div className="page-shell">
            <section className="section section-tight">
                <div className="container">
                    <SectionTitle
                        eyebrow="Events"
                        title="Explore the club calendar"
                        subtitle="Upcoming sessions, workshops, showcases, and archived events — all in one place."
                    />

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