import React from "react";
import AuthForm from "../components/forms/AuthForm";

function LoginPage() {
    return (
        <div className="page-shell auth-page">
            <section className="section auth-page__section">
                <div className="container">
                    <AuthForm type="login" />
                </div>
            </section>
        </div>
    );
}

export default LoginPage;