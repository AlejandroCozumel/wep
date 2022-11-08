import React from "react";
import Table from "../table";
// import Badge from "../badge";
import { myAxios } from "../../utils/api";

import { useQuery} from "@tanstack/react-query";
// import MyModal from "../modal";

const History = () => {
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

  const latestOrders = {
    header: [
      "ID",
      "Cliente",
      "#",
      "Producto",
      "Variante",
      "Opcion",
      "Comentarios",
    ],
    body: historyOrdes?.map((history) => ({
      id: history.id,
      name: history.clientUser.name,
      quantity: history.detail[0]?.quantity,
      product: history.detail[0]?.product.name,
      variant: history.detail[0]?.variants[0]?.productVariant.name,
      option: history.detail[0]?.variants[0]?.options[0]?.optionVariant.name,
      comments: history.comments,
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
      <td>{item.option ? item.option: "❌"}</td>
      <td>{item.comments ? item.option: "❌"}</td>
      {/* <td>
        <Badge type="success" content={item.status} />
      </td> */}
      {/* <td>
        <i
          style={{ marginRight: "10px" }}
          onClick={() => handleChangeEditId(item)}
          className="bx bx-edit"
        ></i>
        <i
          onClick={() => handleChangeDeleteId(item)}
          className="bx bx-trash"
        ></i>
      </td> */}
    </tr>
  );

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log("history", historyOrdes);

  return (
    <div>
      <Table
        limit={10}
        headData={latestOrders.header}
        renderHead={(item, index) => renderHead(item, index)}
        bodyData={latestOrders.body}
        renderBody={(item, index) => renderBody(item, index)}
      />
    </div>
  );
};

export default History;
