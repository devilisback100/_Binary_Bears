import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="page-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;