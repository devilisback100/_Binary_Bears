import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate("/");
    };

    return (
        <header className="navbar app-navbar">
            <div className="container app-navbar__inner">
                <NavLink to="/" className="navbar-brand navbar-brand-yellow" onClick={closeMenu}>
                    Eventara
                </NavLink>

                <button
                    className="btn btn-ghost btn-icon app-navbar__toggle"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <nav className={`app-navbar__nav ${menuOpen ? "is-open" : ""}`}>
                    <div className="app-navbar__links">
                        {NAV_LINKS.map((link) => (
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

                                <span className="btn btn-secondary btn-disabled" aria-disabled="true">
                                    <User size={16} />
                                    Member
                                </span>

                                <button className="btn btn-primary" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={closeMenu} className="btn btn-secondary">
                                    Login
                                </NavLink>
                                <NavLink to="/signup" onClick={closeMenu} className="btn btn-primary">
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