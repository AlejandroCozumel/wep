import React from "react";

const Badge = ({type, content}) => {
  return <span className={`badge badge-${type}`}>{content}</span>;
};

export default Badge;
