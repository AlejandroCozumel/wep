import React from "react";
import Layout from "../components/layout";
import QR from "../components/QR";

const Qr = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Codigo QR </h2>
        <div className="subtitle">Sincroniza tu telefono con nuestro bot.</div>
        <QR />
      </div>
    </Layout>
  );
};

export default Qr;
