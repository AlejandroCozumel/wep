import React from "react";
import Layout from "../../components/layout";
import Profile from "../../components/profile";

const Settings = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Perfil</h2>
        <div className="subtitle"></div>
        <Profile/>
      </div>
    </Layout>
  );
};

export default Settings;
