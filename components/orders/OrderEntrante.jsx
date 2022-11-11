import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myAxios } from "../../utils/api";
import Swal from "sweetalert2";

const OrderEntrante = ({ params }) => {
  const [costPrice, setCostPrice] = useState("");

  const peticionGetFn = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/orders/params?status=${params}`,
    });
    return data;
  };

  const peticionUpdateFn = async (item) => {
    const { data } = await myAxios({
      method: "put",
      url: `/orders/status/${item.id}`,
      data: {
        orderStatus: "ACEPTADO",
        costHomeService: costPrice,
      },
    });
    return data;
  };

  const peticionRollbackUpdateFn = async (item) => {
    const { data } = await myAxios({
      method: "put",
      url: `/orders/status/${item.id}`,
      data: {
        orderStatus: "ENTRANTE",
      },
    });
    return data;
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: orders,
    error,
  } = useQuery([params], peticionGetFn);

  const UpdateOrderMutation = useMutation(peticionUpdateFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(params);
    },
  });

  const RollbackOrderMutation = useMutation(peticionRollbackUpdateFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(params);
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleUpdateOrder = (id) => {
    UpdateOrderMutation.mutate(id);
  };

  const handleRollbackOrder = (id) => {
    RollbackOrderMutation.mutate(id);
  };

  const handleChangeCost = (e) => {
    setCostPrice(e.target.value);
  };

  const handleChangeCreateOrder = (users) => {
    if (!costPrice) {
      Swal.fire(
        `Debes de agregar el costo del servicio a domicilio para poder aceptar la orden`,
        "",
        "warning"
      );
    } else {
      handleUpdateOrder(users);
    }
  };

  console.log(costPrice);

  return (
    <div className="order-main-container">
      <h4 style={{ background: "#4caf50" }}>{params}</h4>
      {orders?.map((users, id) => (
        <div className="card" key={id}>
          <div key={id} className="order-container">
            <div className="order-container__info">
              <div className="order-container__info__client">
                <span>
                  <b>Cliente:</b> {users.clientUser.name}
                </span>
                <span>
                  <b>$ {users.finalAmount}</b>
                </span>
              </div>
              <div className="order-container__info__client">
                <span>
                  <b>Costo de Envio:</b>
                </span>
                <select className="product-select" onChange={handleChangeCost}>
                  <option selected=""></option>
                  <option
                    value={users.establishment?.costHomeService}
                  >{`$ ${users.establishment?.costHomeService}`}</option>
                  <option
                    value={users.establishment?.extendHomeService}
                  >{`$ ${users.establishment?.extendHomeService}`}</option>
                </select>
              </div>
              <div>
                <span>
                  <b>Pedido: </b>
                </span>
              </div>
              <div>
                {users?.detail.map((detail, id) => (
                  <div key={id} className="order-container__info__list">
                    <ul>
                      <li>
                        <b>{detail.quantity}</b>
                        {detail.product.name}
                      </li>
                      {detail.variants?.map((variants, id) => (
                        <div key={id}>
                          <ul key={id} style={{ paddingLeft: "10px" }}>
                            <li>{variants.productVariant.name}</li>
                          </ul>
                          {variants.options?.map((options, id) => (
                            <div key={id}>
                              <ul key={id} style={{ paddingLeft: "20px" }}>
                                <li>{options.optionVariant.name}</li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      ))}
                    </ul>
                    <hr />
                  </div>
                ))}
              </div>
              <div className="order-container__buttons">
                <button
                  className="regresar"
                  onClick={() => handleRollbackOrder(users)}
                >
                  Regresar
                </button>
                <button
                  className="continuar"
                  onClick={() => handleChangeCreateOrder(users)}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderEntrante;
