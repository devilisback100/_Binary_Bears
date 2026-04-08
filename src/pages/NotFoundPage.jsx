import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="page-shell">
            <section className="section">
                <div className="container container-sm">
                    <div className="card card-lg empty-state">
                        <span className="badge badge-danger">404</span>
                        <h1>Page not found</h1>
                        <p className="text-secondary">
                            The page you are trying to open does not exist or has been moved.
                        </p>
                        <Link to="/" className="btn btn-primary">
                            Go home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NotFoundPage;