import React from "react";
import OrdersCard from "./Order";
import OrderEntrante from "./OrderEntrante";


const Orders = () => {

  return (
    <>
      <div className={`col-12 orders `}>
        <OrderEntrante params="ENTRANTE" />
        <OrdersCard params="ACEPTADO" />
        <OrdersCard params="PREPARANDO" />
        <OrdersCard params="LISTO" />
      </div>
    </>
  );
};

export default Orders;
