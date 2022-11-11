import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myAxios } from "../../utils/api";

const Orders = ({ params }) => {
  const peticionGetFn = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/orders/params?status=${params}`,
    });
    return data;
  };

  const peticionUpdateFn = async (item) => {
    let update = "ENTRANTE";
    if (params === "ENTRANTE") {
      update = "ACEPTADO";
    } else if (params === "ACEPTADO") {
      update = "PREPARANDO";
    } else if (params === "PREPARANDO") {
      update = "LISTO";
    } else if (params === "LISTO") {
      update = "ENTREGADO";
    }
    const { data } = await myAxios({
      method: "put",
      url: `/orders/status/${item.id}`,
      data: {
        orderStatus: update,
        costHomeService: item.costHomeService,
      },
    });
    return data;
  };

  const peticionRollbackUpdateFn = async (item) => {
    console.log(item);
    let update = "ENTRANTE";
    if (params === "ACEPTADO") {
      update = "ENTRANTE";
    } else if (params === "PREPARANDO") {
      update = "ACEPTADO";
    } else if (params === "LISTO") {
      update = "PREPARANDO";
    }
    const { data } = await myAxios({
      method: "put",
      url: `/orders/status/${item.id}`,
      data: {
        orderStatus: update,
        costHomeService: item.costHomeService,
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

  let color = "#ff4a6b";

  if (params === "ENTRANTE") {
    color = "#4caf50";
  } else if (params === "ACEPTADO") {
    color = "#62b4ff";
  } else if (params === "PREPARANDO") {
    color = "#fca11a";
  }

  return (
    <>
      <div className="order-main-container">
        <h4 style={{ background: color }}>{params}</h4>
        {orders?.map((users, id) => (
          <div key={id}>
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
                  <span>
                    <b>$ {users.costHomeService}</b>
                  </span>
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
                    onClick={() => handleUpdateOrder(users)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
