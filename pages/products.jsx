import React, { useState } from "react";
import Layout from "../components/layout";
import Table from "../components/table";
import Badge from "../components/badge";
import { myAxios } from "../utils/api";
import MyModal from "../components/modal";

import { Switch } from "@headlessui/react";
import Swal from "sweetalert2";
import Image from "next/image";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = "https://api.wep.mx/";

const optionDays = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
  { value: 7, label: "Domingo" },
];

const Products = () => {
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalAgregarProducto, setShowModalAgregarProducto] =
    useState(false);
  const [enabled, setEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState([{}]);
  const [selectedMeasurement, setSelectedMeasurement] = useState([{}]);
  const [selectedDays, setSelectedDays] = useState([{}]);
  const [formData, setFormData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const [idProduct, setIdProduct] = useState("");

  const deleteModal = () => {
    Swal.fire({
      title: `Quieres eliminar el producto: ${idProduct.name}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`producto ${idProduct.name} eliminado`, "", "success");
        DeleteOrderMutation.mutate();
      } else if (result.isDenied) {
        Swal.fire("Cambios cancelados", "", "info");
      }
    });
  };

  const deleteCategoryModal = () => {
    Swal.fire({
      title: `Quieres eliminar la categoria: ${selectedOption.label}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCategoryMutation.mutate();
      } else if (result.isDenied) {
      }
    });
  };

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

  const peticionDeleteIndividualProducts = async () => {
    const { data } = await myAxios({
      method: "delete",
      url: `/store/categories/products/${idProduct.id}`,
    });
    setSelectedProduct(data);
    return data;
  };

  const peticionAddCategory = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/store/categories`,
        data: formData,
      });
      setSelectedProduct(data);
      Swal.fire({
        title: `Categoria agregada ${formData.name} con exito`,
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: `Error ${formData.name}`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const peticionDeleteCategory = async () => {
    try {
      const { data } = await myAxios({
        method: "delete",
        url: `/store/categories/${selectedOption.value}`,
      });
      setSelectedProduct(data);
      Swal.fire({
        title: `Categoria ${selectedOption.label}, eliminada con exito `,
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: `Error al eliminar ${selectedOption.label} `,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const peticionGetMeasurmentUnits = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/measurementUnits`,
    });
    return data;
  };

  const peticionAddProduct = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/store/categories/products`,
        data: formData,
      });
      setSelectedProduct(data);
      Swal.fire({
        title: `Producto ${formData.name} agregado con exito`,
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (error) {
      Swal.fire({
        title: `Error al crear el producto ${formData.name}
        ${error.response?.data?.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: product,
    error,
  } = useQuery(["categories"], peticionGetProducts);

  const {
    isLoading: isLoadingMeasurmentUnits,
    isError: isErrorMeasurmentUnits,
    data: dataMeasurmentUnits,
    error: errorMeasurmentUnits,
  } = useQuery(["measurmentUnits"], peticionGetMeasurmentUnits);

  const UpdateOrderMutation = useMutation(peticionGetIndividualProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const DeleteOrderMutation = useMutation(peticionDeleteIndividualProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const AddCategoryMutation = useMutation(peticionAddCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const DeleteCategoryMutation = useMutation(peticionDeleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const CreateProductMutation = useMutation(peticionAddProduct, {
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

  if (isLoadingMeasurmentUnits) {
    return <div className="loading-spinner"></div>;
  }

  if (isErrorMeasurmentUnits) {
    return <span>Error: {errorMeasurmentUnits.message}</span>;
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

  const handleClickEditar = () => {
    setShowModalEditar(true);
  };

  const handleClickAgregarCategoria = () => {
    setShowModalAgregar(true);
  };

  const handleClickAgregarProducto = () => {
    setShowModalAgregarProducto(true);
  };

  const handleClickDelete = () => {
    deleteCategoryModal();
  };

  const handleSubmit = () => {
    AddCategoryMutation.mutate();
    setShowModalEditar(false);
    setShowModalAgregar(false);
    setShowModalAgregarProducto(false);
  };

  const handleSubmitAddProduct = () => {
    CreateProductMutation.mutate();
    setShowModalEditar(false);
    setShowModalAgregar(false);
    setShowModalAgregarProducto(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      isPromotional: enabled,
      measurementUnitId: selectedMeasurement?.value,
      storeCategoryId: selectedOption?.value,
      promotionDay: selectedDays?.value,
      productVariants: [],
    }));
  };

  //Add select on change
  // const handleChangeSelect = async ({action, value}) => {
  //   setFormData({ ...formData, [action.name]: value });
  // };

  //Add image to base 64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  //Add image to handle submit
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setFormData({ ...formData, image: base64 });
  };

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
          <i
            style={{ marginBottom: "20px", marginTop: "-10px" }}
            onClick={handleClickAgregarCategoria}
            className="bx bx-message-square-add"
          ></i>
          {selectedProduct && (
            <i
              style={{ marginBottom: "20px", marginTop: "-10px" }}
              onClick={handleClickDelete}
              className="bx bx-trash"
            ></i>
          )}
          {selectedProduct && <h2>Productos:</h2>}
          {selectedProduct && (
            <i
              onClick={handleClickAgregarProducto}
              className="bx bx-message-square-add"
            ></i>
          )}

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
                      <div onClick={() => handleClickEditar()}>
                        <Badge type="success" content="Editar ✏️" />
                      </div>
                      <div onClick={() => deleteModal()}>
                        <Badge type="danger" content="Eliminar 🗑️" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>
          ))}
        </div>
        {showModalEditar ? (
          <MyModal
            title="🥳 Modal Editar"
            onSubmit={handleSubmit}
            isOpen={true}
            submitText="Aceptar"
            cancelText="Cancelar"
            onClose={() => setShowModalEditar(false)}
          >
            <form action="">
              <input type="text" placeholder="hoola" />
            </form>
          </MyModal>
        ) : null}
        {showModalAgregar && (
          <MyModal
            title={`Agrega una nueva categoria:`}
            onSubmit={handleSubmit}
            isOpen={true}
            submitText="Aceptar"
            cancelText="Cancelar"
            onClose={() => setShowModalAgregar(false)}
          >
            <form onSubmit="" className="form">
              <label htmlFor="categoria">Nombre de la categoría:</label>
              <input
                type="text"
                id="categoria"
                name="name"
                placeholder="Nombre"
                onChange={handleChange}
                required
              />
              <div className="form-flex">
                <span>¿Esta categoría es una promoción?</span>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${enabled ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </form>
          </MyModal>
        )}
        {showModalAgregarProducto && (
          <MyModal
            title={`Agrega un nuevo producto:`}
            onSubmit={handleSubmitAddProduct}
            isOpen={true}
            submitText="Aceptar"
            cancelText="Cancelar"
            onClose={() => setShowModalAgregarProducto(false)}
          >
            <form onSubmit={handleSubmitAddProduct} className="form">
              <label htmlFor="category">Nombre de la producto:</label>
              <input
                type="text"
                id="category"
                name="name"
                placeholder="Nombre"
                onChange={handleChange}
                required
              />
              <label htmlFor="price">Precio producto:</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="$ precio"
                onChange={handleChange}
                required
              />
              <label htmlFor="">Unidad de medida:</label>
              <Select
                name="measurementUnitId"
                defaultValue={selectedMeasurement}
                onChange={setSelectedMeasurement}
                options={dataMeasurmentUnits?.map((mesurement) => ({
                  label: mesurement.name,
                  value: mesurement.id,
                }))}
              />
              <label htmlFor="">Dia de promocion:</label>
              <Select
                defaultValue={selectedDays}
                onChange={setSelectedDays}
                options={optionDays}
              />
              <label htmlFor="type">Tipo:</label>
              <input
                type="text"
                id="type"
                name="type"
                placeholder="Comida, Bebidas, Extras"
                onChange={handleChange}
                required
              />
              <label htmlFor="description">Descripcion:</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Descripcion del producto"
                onChange={handleChange}
                required
              />
              <input
                type="file"
                label="Image"
                name="myFile"
                accept=".jpeg, .png, .jpg"
                required
                onChange={handleFileUpload}
              />
            </form>
          </MyModal>
        )}
      </div>
    </Layout>
  );
};

export default Products;
