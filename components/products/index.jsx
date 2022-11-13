import React, { useState } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";
import MyModal from "../modal";
import FullScreen from "../modal/fullscreen";

import { Switch } from "@headlessui/react";
import Swal from "sweetalert2";
import Image from "next/image";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilePicker } from "use-file-picker";

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
  const [showModalEditarVariante, setShowModalEditarVariante] = useState(false);
  const [showModalAgregarVariante, setShowModalAgregarVariante] =
    useState(false);
  const [showModalSubvariants, setShowModalSubvariants] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalAgregarProducto, setShowModalAgregarProducto] =
    useState(false);
  const [enabled, setEnabled] = useState(false);
  const [haveLimitSelect, sethaveLimitSelect] = useState(false);
  const [costGenerate, setCostGenerate] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [quantifySelect, setQuantifySelect] = useState(false);
  const [selectedOption, setSelectedOption] = useState([{}]);
  const [formData, setFormData] = useState({});
  const [formDataVariant, setFormDataVariant] = useState({ name: "" });
  const [formDataSubvariant, setFormDataSubvariant] = useState({ name: "" });
  const [formDataVariantList, setFormDataVariantList] = useState([]);
  const [formDataSubvariantList, setFormDataSubvariantList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedEditMeasureProduct, setSelectedEditMeasureProduct] =
    useState("");
  const [selectedEditDayProduct, setSelectedEditDayProduct] = useState("");
  const [idProduct, setIdProduct] = useState("");

  const productVariants = formDataVariantList?.map((item) => {
    return {
      ...item,
      optionVariants: formDataSubvariantList,
    };
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

  const peticionGetIndividualCategory = async () => {
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

  const peticionGetIndividualProducts = async (item) => {
    try {
      const { data } = await myAxios({
        method: "get",
        url: `/store/categories/products/${item.id}`,
        data: idProduct,
      });
      setIdProduct(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("producto =>", idProduct);

  const peticionUpdateIndividualProducts = async () => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/store/categories/products/${idProduct.id}`,
        data: idProduct.image.includes("data")
          ? idProduct
          : { ...idProduct, image: null },
      });
      setSelectedProduct(data);
      Swal.fire(
        `Producto ${idProduct.name} actualizado con exito`,
        "",
        "success"
      );
      return data;
    } catch (error) {
      Swal.fire(
        `Error al actualizar el producto ${idProduct.name}`,
        "",
        "warning"
      );
    }
  };
  console.log(costGenerate, "costGenerate");
  const peticionAddCategory = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/store/categories`,
        data: { ...formData, isPromotional: enabled },
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
        data: { ...formData, productVariants: productVariants },
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

  const GetIndividualCategoryMutation = useMutation(
    peticionGetIndividualCategory,
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

  const UpdateeProductMutation = useMutation(peticionUpdateIndividualProducts, {
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
    GetIndividualProductMutation.mutate(item);
    setSelectedEditMeasureProduct(
      dataMeasurmentUnits.filter((unit) => unit.id === item.measurementUnitId)
    );
    setSelectedEditDayProduct(
      optionDays.filter((day) => day.value === item.promotionDay)
    );
  };

  const latestOrders = {
    header: [
      "ID",
      "Nombre",
      "Precio",
      "Medida",
      "Descripción",
      "variante",
      "Status",
    ],
    body: [
      {
        id: idProduct.id,
        name: idProduct.name,
        price: idProduct.price,
        measurementUnitId: idProduct.measurementUnitId,
        description: idProduct.description,
        status: idProduct.status,
        productVariants: idProduct.productVariants,
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
      <td>{item.productVariants.map((item) => item.name)}</td>
      <td>
        <Badge type={orderStatus[item.status]} content={item.status} />
      </td>
    </tr>
  );

  const handleClickEditar = () => {
    setShowModalEditar(true);
  };

  const handleCloseModalAgregarProducto = () => {
    setShowModalAgregarProducto(false);
    setFormData("");
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

  const handleShowVariants = () => {
    setShowModalAgregarVariante(false);
    setShowModalSubvariants(false);
  };

  const handleShowVariantsEdit = () => {
    setShowModalEditarVariante(false);
    setShowModalSubvariants(false);
  };

  const handleSelect = (e) => {
    setSelectedOption(e);
    setTimeout(() => {
      GetIndividualCategoryMutation.mutate();
    }, 100);
  };

  const handleSubmit = () => {
    AddCategoryMutation.mutate();
    setShowModalAgregar(false);
  };

  const handleSubmitAddProduct = () => {
    CreateProductMutation.mutate();
    setShowModalAgregarProducto(false);
    setFormData("");
  };

  const handleSubmitEditProduct = () => {
    UpdateeProductMutation.mutate();
    setShowModalEditar(false);
  };

  const handleSubmitAddSubvariant = () => {
    setTimeout(() => {
      if (formDataSubvariant.name !== "") {
        setFormDataSubvariantList((ls) => [...ls, formDataSubvariant]);
        setFormDataSubvariant({
          name: "",
          unitPrice: "",
        });
      } else if (formDataSubvariant.name === "") {
        alert("Debe seleccionar una variante");
      }
    }, 1000);
  };

  console.log("subvariante", formDataSubvariant);
  console.log("costo", costGenerate);
  console.log("cantidad", quantifySelect);
  console.log("array", productVariants);

  const handleSubmitAddVariant = () => {
    if (formDataVariant.name !== "") {
      setFormDataVariantList((ls) => [...ls, formDataVariant]);
      setShowModalAgregarVariante(false);
    } else {
      alert("Debe seleccionar una variante");
    }
  };

  const handleChangeAddSubvariant = (e) => {
    const { name, value } = e.target;
    setFormDataSubvariant({
      ...formDataSubvariant,
      [name]: value,
      costGenerate: costGenerate,
      // inutPrice: 0,
      quantifySelect: quantifySelect,
    });
  };

  const handleChangeAddVariant = (e) => {
    const { name, value } = e.target;
    setFormDataVariant({
      ...formDataVariant,
      [name]: value,
      haveLimitSelect: haveLimitSelect,
      // maxSelect: 0,
      isMandatory: isMandatory,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      storeCategoryId: selectedOption?.value,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setIdProduct({
      ...idProduct,
      [name]: value,
      isPromotional: enabled,
      storeCategoryId: selectedOption?.value,
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

  // console.log("baseimage", baseImage + idProduct.image);
  // console.log("producto product selected", idProduct);
  console.log("producto a crear =>", idProduct);
  // console.log("variante", formDataVariant);
  // console.log("subariante", formDataSubvariant);
  // console.log("subarianteLISTA = >", formDataSubvariantList);
  // console.log("VARIANTE LISTA = >", formDataVariantList);
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

  const handleFileUploadEdit = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setIdProduct({ ...idProduct, image: base64 });
  };

  // const handleFileUploadTest = async (e) => {
  //   openFileSelector();
  // };

  return (
    <>
      <div className="card">
        <Select
          defaultValue={selectedOption}
          onChange={handleSelect}
          options={product?.storeCategories?.map((select) => ({
            label: select.name,
            value: select.id,
          }))}
        />
      </div>
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
            <div className="card">
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
            </div>
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
            <label htmlFor="name">Nombre del producto:</label>
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
              // value={baseImage+idProduct.image}
              onChange={handleFileUploadEdit}
            />
            {idProduct.image.includes("data:image") ? null : (
              <Image
                alt={"imagen"}
                src={baseImage + idProduct.image}
                width={200}
                height={200}
              />
            )}
            <span>Edita o elimina las variantes</span>
            {idProduct.productVariants?.map((item, index) => (
              <div key={index} className="variant-edition">
                <div className="cursor-pointer" onClick={() => setShowModalEditarVariante(true)}>
                  {item.name}
                </div>
                <div className="flex">
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowModalEditarVariante(true)}
                  >
                    ✏️
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowModalEditarVariante(true)}
                  >
                    🗑️
                  </div>
                </div>
              </div>
            ))}
            {/* <div
              className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-gray-600 text-gray-200 hover:bg-gray-900 hover:text-gray-200 focus:outline-none cursor-pointer"
              onClick={() => setShowModalEditarVariante(true)}
            >
              Edita la variante
            </div> */}
            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>

            {/* editar aqui */}
            {showModalEditarVariante ? (
              <MyModal
                title={`Edita la variante del producto:`}
                isOpen={true}
                cancelText="Cancelar"
                onClose={handleShowVariantsEdit}
              >
                <form className="form">
                  <label htmlFor="name">Nombre de la variante:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nombre de la variante"
                    // onChange={handleChangeAddVariant}
                    required
                    value={idProduct.productVariants?.map((item) => item.name)}
                  />
                  <span>¿Tiene un límite de selección?</span>
                  <Switch
                    checked={haveLimitSelect}
                    onChange={sethaveLimitSelect}
                    className={`${
                      haveLimitSelect ? "bg-green-600" : "bg-slate-400"
                    }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        haveLimitSelect ? "translate-x-9" : "translate-x-0"
                      }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  <span>¿Es obligatoria?</span>
                  <Switch
                    checked={isMandatory}
                    onChange={setIsMandatory}
                    className={`${isMandatory ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        isMandatory ? "translate-x-9" : "translate-x-0"
                      }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  {idProduct.productVariants?.map((variant) =>
                    variant.optionVariants?.map((subvariant) => {
                      console.log("ola", subvariant.name);
                      return (
                        <div key={subvariant.id}>
                          <label htmlFor="name">
                            Nombre de la subvariante:
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nombre de la subvariante"
                            onChange={handleChangeAddSubvariant}
                            value={subvariant.name}
                          />
                        </div>
                      );
                    })
                  )}
                  <br />
                  <i
                    style={{ marginBottom: "20px", marginTop: "-10px" }}
                    onClick={() => setShowModalSubvariants(true)}
                    className="bx bx-message-square-add"
                  ></i>
                  {showModalSubvariants ? (
                    <div className="form">
                      <label htmlFor="name">Nombre de la subvariante:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nombre de la subvariante"
                        onChange={handleChangeAddSubvariant}
                        value={formDataSubvariant.name}
                      />
                      <span>¿Generará un costo adicional?</span>
                      <Switch
                        checked={costGenerate}
                        onChange={setCostGenerate}
                        className={`${
                          costGenerate ? "bg-green-600" : "bg-slate-400"
                        }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            costGenerate ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <span>
                        ¿El cliente debe marcar la cantidad a cargar a la
                        compra?
                      </span>
                      <Switch
                        checked={quantifySelect}
                        onChange={setQuantifySelect}
                        className={`${
                          quantifySelect ? "bg-green-600" : "bg-slate-400"
                        }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            quantifySelect ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <div
                        className="continuar"
                        onClick={handleSubmitAddSubvariant}
                      >
                        Agregar Subvariante
                      </div>
                      {formDataSubvariantList?.map((item, index) => {
                        return (
                          <div key={index}>
                            <p>{item.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* termina edicion */}

                  <div className="continuar" onClick={handleSubmitAddVariant}>
                    submit
                  </div>
                </form>
              </MyModal>
            ) : null}
            {/* {showModalEditarVariante ? (
              <MyModal
                title={`Edita la variante del producto:`}
                isOpen={true}
                cancelText="Cancelar"
                onClose={() => setShowModalEditarVariante(false)}
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
                </form>
              </MyModal>
            ) : null} */}
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
              <span>¿Tiene un límite de selección?</span>

              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
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
          onClose={handleCloseModalAgregarProducto}
          fullScreen={true}
        >
          <form onSubmit={handleSubmitAddProduct} className="form">
            <label htmlFor="product">Nombre del producto:</label>
            <input
              type="text"
              id="product"
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
            {/* <div onClick={handleFileUploadTest}>Select files </div>
            <br />
            {filesContent.map((file, index) => (
              <div key={index}>
                <h2>{file.name}</h2>
                <Image
                  alt={file.name}
                  src={file.content}
                  width={50}
                  height={50}
                ></Image>
                <br />
              </div>
            ))} */}
            <div
              className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-gray-500 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none text-center cursor-pointer"
              type="submit"
              onClick={() => setShowModalAgregarVariante(true)}
            >
              Agregar variante
            </div>
            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
            {showModalAgregarVariante ? (
              <MyModal
                title={`Agrega una variante al producto:`}
                isOpen={true}
                cancelText="Cancelar"
                onClose={handleShowVariants}
              >
                <form className="form">
                  <label htmlFor="name">Nombre de la variante:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nombre de la variante"
                    onChange={handleChangeAddVariant}
                    required
                  />
                  <span>¿Tiene un límite de selección?</span>
                  <Switch
                    checked={haveLimitSelect}
                    onChange={sethaveLimitSelect}
                    className={`${
                      haveLimitSelect ? "bg-green-600" : "bg-slate-400"
                    }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        haveLimitSelect ? "translate-x-9" : "translate-x-0"
                      }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  {haveLimitSelect && (
                    <>
                      <label htmlFor="maxSelect">Selecciona maxima:</label>
                      <input
                        type="number"
                        id="maxSelect"
                        name="maxSelect"
                        placeholder="Selecciona maxima:"
                        onChange={handleChangeAddVariant}
                        required
                      />
                    </>
                  )}
                  <span>¿Es obligatoria?</span>
                  <Switch
                    checked={isMandatory}
                    onChange={setIsMandatory}
                    className={`${isMandatory ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        isMandatory ? "translate-x-9" : "translate-x-0"
                      }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  <br />
                  <i
                    style={{ marginBottom: "20px", marginTop: "-10px" }}
                    onClick={() => setShowModalSubvariants(true)}
                    className="bx bx-message-square-add"
                  ></i>
                  {showModalSubvariants ? (
                    <div className="form">
                      <label htmlFor="name">Nombre de la subvariante:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nombre de la subvariante"
                        onChange={handleChangeAddSubvariant}
                        value={formDataSubvariant.name}
                      />
                      <span>¿Generará un costo adicional?</span>
                      <Switch
                        checked={costGenerate}
                        onChange={setCostGenerate}
                        className={`${
                          costGenerate ? "bg-green-600" : "bg-slate-400"
                        }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            costGenerate ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      {costGenerate && (
                        <>
                          <label htmlFor="unitPrice">Precio unitario:</label>
                          <input
                            type="number"
                            id="unitPrice"
                            name="unitPrice"
                            placeholder="Precio unitario:"
                            onChange={handleChangeAddSubvariant}
                            required
                            value={formDataSubvariant.unitPrice}
                          />
                        </>
                      )}
                      <span>
                        ¿El cliente debe marcar la cantidad a cargar a la
                        compra?
                      </span>
                      <Switch
                        checked={quantifySelect}
                        onChange={setQuantifySelect}
                        className={`${
                          quantifySelect ? "bg-green-600" : "bg-slate-400"
                        }
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            quantifySelect ? "translate-x-9" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      {formDataSubvariantList?.map((item, index) => {
                        return (
                          <div key={index}>
                            <p>{item.name}</p>
                          </div>
                        );
                      })}
                      <div
                        className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-gray-500 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none text-center cursor-pointer"
                        onClick={handleSubmitAddSubvariant}
                      >
                        Agregar Subvariante
                      </div>
                    </div>
                  ) : null}
                  <div
                    className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none text-center"
                    onClick={handleSubmitAddVariant}
                  >
                    Aceptar
                  </div>
                </form>
              </MyModal>
            ) : null}
          </form>
        </MyModal>
      )}
    </>
  );
};

export default Products;
