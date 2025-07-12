// src/components/Card.js
import React from "react";

const Card = ({ title, children, footer }) => {
  return (
    <div className="card bg-base-100 shadow-xl rounded-lg">
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        <div>{children}</div>
        {footer && <div className="card-actions justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export default Card;
