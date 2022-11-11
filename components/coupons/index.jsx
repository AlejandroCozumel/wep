import React, { useState } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";
import dateFormat from "dateformat";

import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyModal from "../modal";
import Swal from "sweetalert2";

const discountType = [
  { value: "porcentaje", label: "Porcentaje" },
  { value: "dinero", label: "Dinero" },
];

const serviceType = [
  { value: "ordene", label: "Ordene y recoja" },
  { value: "domicilio", label: "A domicilio" },
  { value: "Ambos", label: "Ambos" },
];

const Cupones = () => {
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState("");

  const deleteModal = (indexRol) => {
    Swal.fire({
      title: `Quieres eliminar el coupon: ${indexRol.id}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCouponMutation.mutate(indexRol);
      } else if (result.isDenied) {
        Swal.fire("Cambios cancelados", "", "info");
      }
    });
  };

  const peticionGetCouopon = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/coupons`,
    });
    return data;
  };

  const peticionUpdateCoupon = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/coupons/${indexRol.id}`,
        data: indexRol,
      });
      Swal.fire(`Cupon ${indexRol.name} editado`, "", "success");
      setIsFetching(false);
      setFormData("");
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const peticionDeleteCoupon = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "delete",
        url: `/coupons/${indexRol.id}`,
      });
      Swal.fire(`Cupon ${indexRol.name} eliminado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const peticionCreateRol = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/coupons`,
        data: formData,
      });
      Swal.fire(`Coupon agregado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      Swal.fire(`error`);
    }
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: userCoupons,
    error,
  } = useQuery(["getcoupon"], peticionGetCouopon);

  const UpdateCouponMutation = useMutation(peticionUpdateCoupon, {
    onSuccess: () => {
      queryClient.invalidateQueries("getcoupon");
    },
  });

  const DeleteCouponMutation = useMutation(peticionDeleteCoupon, {
    onSuccess: () => {
      queryClient.invalidateQueries("getcoupon");
    },
  });

  const CreateRoleMutation = useMutation(peticionCreateRol, {
    onSuccess: () => {
      queryClient.invalidateQueries("getcoupon");
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleSubmit = () => {
    CreateRoleMutation.mutate();
    setShowModalAgregar(false);
  };

  const handleSubmitEditar = () => {
    UpdateCouponMutation.mutate(formData);
    setShowModalEditar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e) => {
    setFormData({ ...formData, discountType: e.value });
  };

  const handleChangeSelectType = (e) => {
    setFormData({ ...formData, serviceType: e.value });
  };

  const handleChangeEditId = (item) => {
    setShowModalEditar(true);
    setFormData(item);
  };

  const handleChangeDeleteId = (item) => {
    deleteModal(item);
  };

  const handleModalAgregar = () => {
    setFormData("");
    setShowModalAgregar(false);
  };

  const latestOrders = {
    header: [
      "ID",
      "Nombre",
      "Fehca inicio",
      "Fecha fin",
      "Descuento",
      "Descripción",
      "Status",
      "Acción",
    ],
    body: userCoupons?.map((coupon) => ({
      id: coupon.id,
      name: coupon.name,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      discountImport: coupon.discountImport,
      description: coupon.description,
      status: coupon.status.toString(),
      useLimitUser: coupon.useLimitUser,
      serviceType: coupon.serviceType,
      discountType: coupon.discountType,
      fromAmount: coupon.fromAmount,
      quantify: coupon.quantify,
    })),
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{dateFormat(item.startDate, "dddd, mmmm dS")}</td>
      <td>{dateFormat(item.endDate, "dddd, mmmm dS")}</td>
      <td>{item.discountType === "porcentaje" ? "%" : "$"} {item.discountImport}</td>
      <td>{item.description}</td>
      <td>
        <Badge type="success" content={item.status} />
      </td>
      <td>
        <i
          style={{ marginRight: "10px" }}
          onClick={() => handleChangeEditId(item)}
          className="bx bx-edit"
        ></i>
        <i
          onClick={() => handleChangeDeleteId(item)}
          className="bx bx-trash"
        ></i>
      </td>
    </tr>
  );

  return (
    <>
      <i
        style={{ marginBottom: "20px", marginTop: "-10px" }}
        onClick={() => setShowModalAgregar(true)}
        className="bx bx-message-square-add"
      ></i>
      <div className="search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      {isFetching && (
        <Table
          limit={5}
          headData={latestOrders.header}
          renderHead={(item, index) => renderOrderHead(item, index)}
          bodyData={latestOrders.body}
          renderBody={(item, index) => renderOrderBody(item, index)}
        />
      )}
      {showModalAgregar ? (
        <MyModal
          title="Crea un nuevo Cupon"
          isOpen={true}
          cancelText="Cancelar"
          onClose={handleModalAgregar}
        >
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="name">Nombre del cupon:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Descripción"
              onChange={handleChange}
              required
            />
            <label htmlFor="startDate">Fecha de inicio:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              placeholder="startDate"
              onChange={handleChange}
              required
            />
            <label htmlFor="endDate">Fecha de fin:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              placeholder="endDate"
              onChange={handleChange}
              required
            />
            <label htmlFor="useLimitUser">Limite de uso por usuario:</label>
            <input
              type="number"
              id="useLimitUser"
              name="useLimitUser"
              placeholder="Limite por usuario"
              onChange={handleChange}
              required
            />
            <label htmlFor="fromAmount">A partir de:</label>
            <input
              type="number"
              id="fromAmount"
              name="fromAmount"
              placeholder="A partir de"
              onChange={handleChange}
              required
            />
            <label htmlFor="discountType">Tipo de descuento:</label>
            <Select
              name="discountType"
              defaultValue=""
              onChange={handleChangeSelect}
              options={discountType}
            />
            <label htmlFor="discountImport">Descuento:</label>
            <input
              type="number"
              id="discountImport"
              name="discountImport"
              placeholder={formData.discountType === "porcentaje" ? "% Porcentaje" : "$ Cantidad"}
              onChange={handleChange}
              required
            />
            <label htmlFor="serviceType">Tipo de servicio:</label>
            <Select
              name="serviceType"
              defaultValue=""
              onChange={handleChangeSelectType}
              options={serviceType}
            />
            <label htmlFor="quantify">Cupones a dar:</label>
            <input
              type="number"
              id="quantify"
              name="quantify"
              placeholder="Cantidad de cupones"
              onChange={handleChange}
              required
            />
            <button className="rounded-sm mt-3 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      ) : null}
      {showModalEditar ? (
        <MyModal
          title="Edita el Cupon seleccionado"
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalEditar(false)}
        >
          <form onSubmit={handleSubmitEditar} className="form">
            <label htmlFor="name">Nombre del cupon:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.name}
              required
            />
            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Descripción"
              onChange={handleChange}
              value={formData.description}
              required
            />
            <label htmlFor="startDate">Fecha de inicio:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              placeholder="startDate"
              onChange={handleChange}
              value={dateFormat(formData.startDate, "yyyy-mm-dd")}
              required
            />
            <label htmlFor="endDate">Fecha de fin:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              placeholder="endDate"
              onChange={handleChange}
              value={dateFormat(formData.endDate, "yyyy-mm-dd")}
              required
            />
            <label htmlFor="useLimitUser">Limite de uso por usuario:</label>
            <input
              type="number"
              id="useLimitUser"
              name="useLimitUser"
              placeholder="useLimitUser"
              onChange={handleChange}
              value={formData.useLimitUser}
              required
            />
            <label htmlFor="fromAmount">A partir de:</label>
            <input
              type="number"
              id="fromAmount"
              name="fromAmount"
              placeholder="fromAmount"
              onChange={handleChange}
              value={formData.fromAmount}
              required
            />
            <label htmlFor="discountType">Tipo de descuento:</label>
            <Select
              name="discountType"
              defaultValue={{
                label: formData.discountType,
                value: formData.discountType,
              }}
              onChange={handleChangeSelect}
              options={discountType}
            />
            <label htmlFor="discountType">Descuento:</label>
            <input
              type="number"
              id="discountImport"
              name="discountImport"
              placeholder="discountImport"
              onChange={handleChange}
              value={formData.discountImport}
              required
            />
            <label htmlFor="serviceType">Tipo de servicio:</label>
            <Select
              name="serviceType"
              defaultValue={{
                label: formData.serviceType,
                value: formData.serviceType,
              }}
              onChange={handleChangeSelectType}
              options={serviceType}
            />
            <label htmlFor="quantify">Cupones a dar:</label>
            <input
              type="number"
              id="quantify"
              name="quantify"
              placeholder="quantify"
              onChange={handleChange}
              value={formData.quantify}
              required
            />
            <button className="rounded-sm mt-3 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      ) : null}
    </>
  );
};

export default Cupones;
