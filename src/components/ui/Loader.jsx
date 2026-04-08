import React from "react";

function Loader({ text = "Loading..." }) {
    return (
        <div className="state-block">
            <div className="loader-orbit" aria-hidden="true" />
            <p className="text-sm text-muted">{text}</p>
        </div>
    );
}

export default Loader;