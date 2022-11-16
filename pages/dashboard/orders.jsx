import Layout from "../../components/layout";
import Orders from "../../components/orders";

export default function Order() {
  return (
    <Layout>
      <div className="page-header">
        <h2>Ordenes </h2>
        <div className="subtitle">Ve la lista de los pedidos, y toma el control de cada uno.</div>
          <div className="row">
            <Orders/>
          </div>
      </div>
    </Layout>
  );
}
