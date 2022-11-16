import React from "react";
import Layout from "../../components/layout";
import Roles from "../../components/roles";

const Rol = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Roles</h2>
        <div className="subtitle">
          Ve la lista de roles, edita, habilita/deshabilita o agrega nuevos
        </div>
        <Roles />
      </div>
    </Layout>
  );
};

export default Rol;
