import Layout from "../components/layout";
import Orders from "../components/orders";

export default function Order() {
  return (
    <Layout>
      <div className="page-header">
        <h2>Ordenes </h2>
          <div className="row">
            <Orders/>
          </div>
      </div>
    </Layout>
  );
}
