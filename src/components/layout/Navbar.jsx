import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ShieldCheck } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate("/");
    };

    const role = user?.role?.toLowerCase?.() || "member";
    const isAdmin = role === "admin";

    const roleLabel = useMemo(() => {
        if (role === "admin") return "Admin";
        if (role === "core") return "Core Team";
        if (role === "moderator") return "Moderator";
        return "Member";
    }, [role]);

    const visibleLinks = useMemo(() => {
        return NAV_LINKS.filter((link) => {
            if (link.adminOnly && !isAdmin) return false;
            if (link.authOnly && !isAuthenticated) return false;
            if (link.guestOnly && isAuthenticated) return false;
            return true;
        });
    }, [isAdmin, isAuthenticated]);

    return (
        <header className="navbar app-navbar">
            <div className="container app-navbar__inner">
                <NavLink
                    to="/"
                    className="navbar-brand navbar-brand-yellow"
                    onClick={closeMenu}
                >
                    Eventara
                </NavLink>

                <button
                    className="btn btn-ghost btn-icon app-navbar__toggle"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    type="button"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <nav
                    id="primary-navigation"
                    className={`app-navbar__nav ${menuOpen ? "is-open" : ""}`}
                >
                    <div className="app-navbar__links">
                        {visibleLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {isAuthenticated && isAdmin && (
                            <NavLink
                                to="/admin"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Admin Dashboard
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
                                        <span className="text-sm weight-semibold">
                                            {user?.name || "Member"}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`btn btn-secondary btn-disabled ${isAdmin ? "role-badge role-badge-admin" : "role-badge"
                                        }`}
                                    aria-disabled="true"
                                    title={`Role: ${roleLabel}`}
                                >
                                    {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                                    {roleLabel}
                                </span>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleLogout}
                                    type="button"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    onClick={closeMenu}
                                    className="btn btn-secondary"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup"
                                    onClick={closeMenu}
                                    className="btn btn-primary"
                                >
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