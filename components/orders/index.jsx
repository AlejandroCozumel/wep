import React from "react";
import OrderEntrante from "./OrderEntrante";

const Orders = () => {

  return (
    <>
      <div className={`col-12 orders `}>
        <OrderEntrante params="ENTRANTE" />
        <OrderEntrante params="ACEPTADO" />
        <OrderEntrante params="PREPARANDO" />
        <OrderEntrante params="LISTO" />
      </div>
    </>
  );
};

export default Orders;
