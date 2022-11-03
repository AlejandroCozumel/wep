import React, { useState } from "react";
import Layout from "../components/layout";
import Table from "../components/table";
import Badge from "../components/badge";

import Image from "next/image";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myAxios } from "../utils/api";

const baseUrl = "https://api.wep.mx/";

const Products = () => {
  const [selectedOption, setSelectedOption] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [idProduct, setIdProduct] = useState("");

  const latestOrders = {
    header: ["ID", "Nombre", "Precio", "Medida", "Descripción", "Status"],
    body: [
      {
        id: idProduct.id,
        nombre: idProduct.name,
        precio: idProduct.price,
        medida: idProduct.measurementUnitId,
        descripcion: idProduct.description,
        status: idProduct.status,
      },
    ],
  };

  const orderStatus = {
    ACTIVO: "success",
    INACTIVO: "danger",
  };

  const peticionGetProducts = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/store/categories`,
    });
    return data;
  };

  const peticionGetIndividualProducts = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/store/categories/${selectedOption.value}`,
    });
    setSelectedProduct(data);
    return data;
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: product,
    error,
  } = useQuery(["categories"], peticionGetProducts);

  const UpdateOrderMutation = useMutation(peticionGetIndividualProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const hanleClick = () => {
    UpdateOrderMutation.mutate();
  };

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleItem = (item) => {
    setIdProduct(item);
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.nombre}</td>
      <td>{item.precio}</td>
      <td>{item.medida}</td>
      <td>{item.descripcion}</td>
      <td>
        <Badge type={orderStatus[item.status]} content={item.status} />
      </td>
    </tr>
  );

  console.log("id", idProduct);
  return (
    <Layout>
      <div className={`page-header product-container`}>
        <h2>Categorias:</h2>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={product?.storeCategories?.map((select) => ({
            label: select.name,
            value: select.id,
          }))}
        />
        <button className="continuar" onClick={hanleClick}>
          Aceptar
        </button>
        <div>
          {selectedProduct && <h2>Productos:</h2>}
          {selectedProduct?.products?.map((item) => (
            <div className="product-container__item" key={item.id}>
              <>
                <div
                  onClick={() => handleItem(item)}
                  className="product-container__list-item"
                >
                  <Image
                    src={`${baseUrl}${item.image}`}
                    alt={item.name}
                    width={45}
                    height={45}
                  />
                  <span>{item.description}</span>
                  <i className="bx bx-right-arrow"></i>
                </div>
                {idProduct.id === item.id && (
                  <div className="product-container__list-item-detail">
                    <div>
                      <Image
                        src={`${baseUrl}${item.image}`}
                        alt=""
                        width={300}
                        height={300}
                      />
                    </div>
                    <Table
                      headData={latestOrders.header}
                      renderHead={(item, index) => renderOrderHead(item, index)}
                      bodyData={latestOrders.body}
                      renderBody={(item, index) => renderOrderBody(item, index)}
                    />
                    <div className="buttons">
                      <Badge type="success" content="Editar ✏️" />
                      <Badge type="danger" content="Eliminar 🗑️" />
                    </div>
                  </div>
                )}
              </>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
