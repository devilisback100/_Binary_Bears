import React from "react";
import AuthForm from "../components/forms/AuthForm";
import "../styles/Auth.css";

function SignupPage() {
    return (
        <div className="page-shell auth-page">
            <section className="auth-page__section">
                <div className="container">
                    <AuthForm type="signup" />
                </div>
            </section>
        </div>
    );
}

export default SignupPage;