import React from "react";
import Layout from "../components/layout";
import Users from "../components/users";

const Rol = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Usuarios</h2>
        <div className="subtitle">
        Ve la lista de usuarios, edita, habilita/deshabilita o agrega nuevos
        </div>
        <Users />
      </div>
    </Layout>
  );
};

export default Rol;
