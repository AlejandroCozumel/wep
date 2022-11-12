import React, { useState } from "react";
import Table from "../table";
// import Badge from "../badge";
import { myAxios } from "../../utils/api";

import { useQuery } from "@tanstack/react-query";
import MyModal from "../modal";

const History = () => {
  const [showModalView, setShowModalView] = useState(false);

  const peticionGetOrderHistrory = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/history/orders`,
    });
    return data;
  };

  const {
    isLoading,
    isError,
    data: historyOrdes,
    error,
  } = useQuery(["getorderhistory"], peticionGetOrderHistrory);

  const handleChangeView = (item) => {
    console.log(item);
    setShowModalView(true);
  };

  const latestOrders = {
    header: [
      "ID",
      "Cliente",
      "#",
      "Producto",
      "Variante",
      "Opcion",
      "Comentarios",
      "Precio",
      "Ver",
    ],
    body: historyOrdes?.map((history) => ({
      id: history.id,
      name: history.clientUser.name,
      quantity: history.detail[0]?.quantity,
      product: history.detail[0]?.product.name,
      variant: history.detail[0]?.variants[0]?.productVariant.name,
      option: history.detail[0]?.variants[0]?.options[0]?.optionVariant.name,
      comments: history.comments,
      amount: history.amount,
    })),
  };

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.quantity}</td>
      <td>{item.product}</td>
      <td>{item.variant ? item.variant : "❌"}</td>
      <td>{item.option ? item.option : "❌"}</td>
      <td>{item.comments ? item.option : "❌"}</td>
      <td>$ {item.amount}</td>
      <td>
        <i
          onClick={() => handleChangeView(item)}
          className="bx bx-plus-medical"
        ></i>
      </td>
    </tr>
  );

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // console.log("history", historyOrdes);

  return (
    <div>
      <div className="search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="card">
        <Table
          limit={10}
          headData={latestOrders.header}
          renderHead={(item, index) => renderHead(item, index)}
          bodyData={latestOrders.body}
          renderBody={(item, index) => renderBody(item, index)}
        />
      </div>
      {showModalView ? (
        <MyModal
          title="Detalle del cliente"
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalView(false)}
        >
          {/* <h2>Hola</h2> */}
        </MyModal>
      ) : null}
    </div>
  );
};

export default History;
