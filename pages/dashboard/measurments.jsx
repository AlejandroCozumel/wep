import React from "react";
import Layout from "../../components/layout";
import Measurement from "../../components/measurementUnit";

const Measurments = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Mediciones</h2>
        <div className="subtitle">
          Ve la lista de Mediciones, edita, habilita/deshabilita o agrega nuevos
        </div>
        <Measurement/>
      </div>
    </Layout>
  );
};

export default Measurments;
