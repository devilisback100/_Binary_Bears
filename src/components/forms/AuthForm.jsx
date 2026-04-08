import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function AuthForm({ type = "login" }) {
    const isSignup = type === "signup";
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        skills: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            if (isSignup) {
                await signup({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    skills: formData.skills
                        ? formData.skills.split(",").map((item) => item.trim()).filter(Boolean)
                        : [],
                });
            } else {
                await login({
                    email: formData.email.trim(),
                    password: formData.password,
                });
            }

            navigate("/");
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="card card-lg auth-card">
                <div className="stack stack-4">
                    <span className="badge badge-brand">
                        {isSignup ? "Create account" : "Welcome back"}
                    </span>

                    <div className="stack stack-2">
                        <h2>{isSignup ? "Join the club" : "Login to Eventara"}</h2>
                        <p className="text-secondary">
                            {isSignup
                                ? "Create your account to explore events, projects, and community updates."
                                : "Use your account to access event registration and your personalized experience."}
                        </p>
                    </div>

                    {error ? <div className="alert alert-danger">{error}</div> : null}

                    <form className="stack stack-4" onSubmit={handleSubmit}>
                        {isSignup ? (
                            <div className="form-group">
                                <label className="label" htmlFor="name">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    className="input"
                                    type="text"
                                    placeholder="Mahesh Paliwal"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ) : null}

                        <div className="form-group">
                            <label className="label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                className="input"
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isSignup ? (
                            <div className="form-group">
                                <label className="label" htmlFor="skills">
                                    Skills
                                </label>
                                <input
                                    id="skills"
                                    name="skills"
                                    className="input"
                                    type="text"
                                    placeholder="React, Node, UI/UX"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                                <span className="field-hint">Comma separated skills.</span>
                            </div>
                        ) : null}

                        <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={submitting}>
                            {submitting ? "Please wait..." : isSignup ? "Create account" : "Login"}
                        </button>
                    </form>

                    <p className="text-sm text-secondary auth-switch">
                        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
                        <Link to={isSignup ? "/login" : "/signup"}>
                            {isSignup ? "Login" : "Sign up"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;