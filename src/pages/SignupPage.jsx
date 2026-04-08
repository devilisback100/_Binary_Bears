import React from "react";
import AuthForm from "../components/forms/AuthForm";

function SignupPage() {
    return (
        <div className="page-shell auth-page">
            <section className="section auth-page__section">
                <div className="container">
                    <AuthForm type="signup" />
                </div>
            </section>
        </div>
    );
}

export default SignupPage;