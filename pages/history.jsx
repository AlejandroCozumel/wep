import React from "react";
import HistoryTable from "../components/history";

import Layout from "../components/layout";

const History = () => {
  return (
    <Layout>
      <div>
        <div className="page-header">
          <h2>Historial de pedidos :</h2>
          <div className="subtitle">
            En este apartado podras ver la lista de los pedidos recientes.
          </div>
          <HistoryTable/>
        </div>
      </div>
    </Layout>
  );
};

export default History;
