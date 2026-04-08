import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
    return (
        <footer className="app-footer surface-dark">
            <div className="container app-footer__inner">
                <div className="stack stack-2">
                    <span className="navbar-brand navbar-brand-yellow">Eventara</span>
                    <p className="text-sm text-on-dark app-footer__copy">
                        A modern club platform for events, projects, team culture, and community growth.
                    </p>
                </div>

                <div className="app-footer__links">
                    <NavLink to="/" className="app-footer__link">Home</NavLink>
                    <NavLink to="/team" className="app-footer__link">Team</NavLink>
                    <NavLink to="/events" className="app-footer__link">Events</NavLink>
                    <NavLink to="/projects" className="app-footer__link">Projects</NavLink>
                </div>
            </div>
        </footer>
    );
}

export default Footer;