import React from "react";
import Layout from "../layout";

const Fullscreen = ({ children }) => {
  return (
    <Layout>
      <div className="fullscreen">{children}</div>
    </Layout>
  );
};

export default Fullscreen;
