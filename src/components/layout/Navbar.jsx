import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ShieldCheck } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    const role = user?.role?.toLowerCase?.() || "member";
    const isAdmin = role === "admin";

    const roleLabel = useMemo(() => {
        const map = { admin: "Admin", core: "Core Team", moderator: "Moderator" };
        return map[role] || "Member";
    }, [role]);

    const visibleLinks = useMemo(() =>
        NAV_LINKS.filter((link) => {
            if (link.adminOnly && !isAdmin) return false;
            if (link.authOnly && !isAuthenticated) return false;
            if (link.guestOnly && isAuthenticated) return false;
            return true;
        }),
        [isAdmin, isAuthenticated]
    );

    return (
        <header className="app-navbar">
            <div className="app-navbar__inner">

                <NavLink to="/" className="navbar-brand-yellow" onClick={() => setMenuOpen(false)}>
                    UtsavHub
                </NavLink>

                <button
                    className="btn btn-ghost btn-icon app-navbar__toggle"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    type="button"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <nav id="primary-navigation" className={`app-navbar__nav ${menuOpen ? "is-open" : ""}`}>

                    <div className="app-navbar__links">
                        {visibleLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {isAuthenticated && isAdmin && (
                            <NavLink
                                to="/admin"
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                            >
                                Admin
                            </NavLink>
                        )}
                    </div>

                    <div className="app-navbar__actions">
                        {isAuthenticated ? (
                            <>
                                <div className="app-navbar__user">
                                    <span className="avatar-initials avatar-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                    <div className="app-navbar__user-text">
                                        <span className="label-xs">Signed in</span>
                                        <span className="text-sm weight-semibold">{user?.name || "Member"}</span>
                                    </div>
                                </div>

                                <span
                                    className={`role-badge${isAdmin ? " role-badge-admin" : ""}`}
                                    aria-disabled="true"
                                    title={`Role: ${roleLabel}`}
                                >
                                    {isAdmin ? <ShieldCheck size={13} /> : <User size={13} />}
                                    {roleLabel}
                                </span>

                                <button className="btn btn-primary" onClick={handleLogout} type="button">
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={() => setMenuOpen(false)} className="btn btn-secondary">
                                    Login
                                </NavLink>
                                <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="btn btn-primary">
                                    Join Club
                                </NavLink>
                            </>
                        )}
                    </div>

                </nav>
            </div>
        </header>
    );
}

export default Navbar;