import React from "react";

function SectionTitle({ eyebrow, title, subtitle, align = "left" }) {
    return (
        <div className={`section-title section-title--${align}`}>
            {eyebrow ? <span className="label-xs">{eyebrow}</span> : null}
            <h2>{title}</h2>
            {subtitle ? <p className="text-secondary section-title__subtitle">{subtitle}</p> : null}
        </div>
    );
}

export default SectionTitle;