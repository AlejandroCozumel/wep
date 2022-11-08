import React from "react";
import Layout from "../components/layout";
import Products from "../components/products";

const Productos = () => {
  return (
    <Layout>
      <div className={`page-header product-container`}>
        <h2>Categorias:</h2>
        <div className="subtitle">
          Ve la lista de productos, edita, habilita/deshabilita o agrega nuevos
        </div>
        <Products/>
      </div>
    </Layout>
  );
};

export default Productos;
