import React from "react";
import Layout from "../components/layout";
import Coupons from "../components/coupons";

const Cupones = () => {
  return (
    <Layout>
      <div className="page-header">
        <h2>Cupones</h2>
        <div className="subtitle">
          Ve la lista de cupones, edita, habilita/deshabilita o agrega nuevos
        </div>
        <Coupons />
      </div>
    </Layout>
  );
};

export default Cupones;
