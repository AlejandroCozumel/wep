import React, { useState } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";
import MyModal from "../modal";

import { Switch } from "@headlessui/react";
import Swal from "sweetalert2";
import Image from "next/image";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = "https://api.wep.mx/";
const baseImage = "https://api.wep.mx";

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
  const [formData, setFormData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedEditMeasureProduct, setSelectedEditMeasureProduct] = useState("");
  const [selectedEditDayProduct, setSelectedEditDayProduct] = useState("");
  const [idProduct, setIdProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    measurementUnitId: "",
    status: "",
  });

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

  // const { data: individualProduct } = useQuery(
  //   ["getIndividualProducts"],
  //   peticionGetIndividualProducts
  // );

  const GetIndividualProductMutation = useMutation(
    peticionGetIndividualProducts,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

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
    setSelectedEditMeasureProduct(dataMeasurmentUnits.filter((unit) => unit.id === item.measurementUnitId));
    setSelectedEditDayProduct(optionDays.filter((day) => day.value === item.promotionDay))
  };

  // console.log('ola k ase',idProduct);

  const latestOrders = {
    header: ["ID", "Nombre", "Precio", "Medida", "Descripción", "Status"],
    body: [
      {
        id: idProduct.id,
        name: idProduct.name,
        price: idProduct.price,
        measurementUnitId: idProduct.measurementUnitId,
        description: idProduct.description,
        status: idProduct.status,
      },
    ],
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>{item.measurementUnitId}</td>
      <td>{item.description}</td>
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

  const handleSelect = (e) => {
    setSelectedOption(e);
    setTimeout(() => {
      GetIndividualProductMutation.mutate();
    }, 100);
  };

  const handleSubmit = () => {
    AddCategoryMutation.mutate();
    setShowModalAgregar(false);
  };

  const handleSubmitAddProduct = () => {
    CreateProductMutation.mutate();
    setShowModalAgregarProducto(false);
  };

  const handleSubmitEditProduct = () => {
    console.log("editando");
    setShowModalEditar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...idProduct,
      [name]: value,
      isPromotional: enabled,
      storeCategoryId: selectedOption?.value,
      productVariants: [],
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setIdProduct({
      ...idProduct,
      [name]: value,
      isPromotional: enabled,
      storeCategoryId: selectedOption?.value,
      productVariants: [],
    });
  };

  const handleChangeSelectMeasurment = (e) => {
    setFormData({ ...formData, measurementUnitId: e.value });
  };

  const handleChangeSelectEditMeasurment = (e) => {
    setIdProduct({ ...idProduct, measurementUnitId: e.value });
  };

  const handleChangeSelectDays = (e) => {
    setFormData({ ...formData, promotionDay: e.value });
  };

  const handleChangeEditSelectDays = (e) => {
    setIdProduct({ ...idProduct, promotionDay: e.value });
  };

  console.log("form", baseImage + idProduct.image);
  console.log("producto product selected", idProduct);
  // console.log("product category selected", selectedProduct);
  // console.log("datafromback",product)
  // console.log("measurmentidfrombackend",dataMeasurmentUnits)

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
    <>
      <Select
        defaultValue={selectedOption}
        onChange={handleSelect}
        options={product?.storeCategories?.map((select) => ({
          label: select.name,
          value: select.id,
        }))}
      />
      <div>
        <br />
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
                <span>{item.name}</span>
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
      {showModalEditar && (
        <MyModal
          title={`Edita el producto seleccionado:`}
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalEditar(false)}
        >
          <form onSubmit={handleSubmitEditProduct} className="form">
            <label htmlFor="name">Nombre de la producto:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChangeEdit}
              required
              value={idProduct.name}
            />
            <label htmlFor="price">Precio producto:</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="$ precio"
              onChange={handleChangeEdit}
              required
              value={idProduct.price}
            />
            <label htmlFor="measurementUnitId">Unidad de medida:</label>
            <Select
              name="measurementUnitId"
              defaultValue={selectedEditMeasureProduct?.map((mesurement) => ({
                label: mesurement.name,
                value: mesurement.id,
              }))}
              onChange={handleChangeSelectEditMeasurment}
              options={dataMeasurmentUnits?.map((mesurement) => ({
                label: mesurement.name,
                value: mesurement.id,
              }))}
            />
            <label htmlFor="">Dia de promocion:</label>
            <Select
              defaultValue={selectedEditDayProduct?.map((day) => ({
                label: day.label,
                value: day.value,
              }))}
              onChange={handleChangeEditSelectDays}
              options={optionDays}
            />
            <label htmlFor="type">Tipo:</label>
            <input
              type="text"
              id="type"
              name="type"
              placeholder="Comida, Bebidas, Extras"
              onChange={handleChangeEdit}
              required
              value={idProduct.type}
            />
            <label htmlFor="description">Descripcion:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Descripcion del producto"
              onChange={handleChangeEdit}
              required
              value={idProduct.description}
            />
            <input
              type="file"
              label="Image"
              name="myFile"
              accept=".jpeg, .png, .jpg"
              required
              // value={baseImage+idProduct.image}
              onChange={handleFileUpload}
            />
            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      )}
      {showModalAgregar && (
        <MyModal
          title={`Agrega una nueva categoria:`}
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalAgregar(false)}
        >
          <form onSubmit={handleSubmit} className="form">
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
            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      )}
      {showModalAgregarProducto && (
        <MyModal
          title={`Agrega un nuevo producto:`}
          isOpen={true}
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
              defaultValue=""
              onChange={handleChangeSelectMeasurment}
              options={dataMeasurmentUnits?.map((mesurement) => ({
                label: mesurement.name,
                value: mesurement.id,
              }))}
            />
            <label htmlFor="">Dia de promocion:</label>
            <Select
              defaultValue=""
              onChange={handleChangeSelectDays}
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
            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      )}
    </>
  );
};

export default Products;
