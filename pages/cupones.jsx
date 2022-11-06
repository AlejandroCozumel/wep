import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Table from "../components/table";
import Badge from "../components/badge";
import { myAxios } from "../utils/api";

import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyModal from "../components/modal";
import Swal from "sweetalert2";

const Cupones = () => {
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
        url: `/roles`,
        data: formData,
      });
      Swal.fire(`Rol agregado`, "", "success");
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
    alert("editar");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e) => {
    setFormData({ ...formData, menusId: e?.map((item) => item.value) });
  };

  const handleChangeEditId = (item) => {
    setShowModalEditar(true);
    setFormData(item);
  };

  const handleChangeDeleteId = (item) => {
    console.log(item)
    deleteModal(item);
  };
  console.log(userCoupons);
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
    })),
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.startDate}</td>
      <td>{item.endDate}</td>
      <td>% {item.discountImport}</td>
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
        {/* {console.log(item)} */}
        <i
          onClick={() => handleChangeDeleteId(item)}
          className="bx bx-trash"
        ></i>
      </td>
    </tr>
  );

  return (
    <Layout>
      <div className="page-header">
        <h2>Cupones</h2>
        <div className="subtitle">
          Ve la lista de cupones, edita, habilita/deshabilita o agrega nuevos
        </div>
        <i
          style={{ marginBottom: "20px", marginTop: "-10px" }}
          onClick={() => setShowModalAgregar(true)}
          className="bx bx-message-square-add"
        ></i>
        {isFetching && (
          <Table
            limit={5}
            headData={latestOrders.header}
            renderHead={(item, index) => renderOrderHead(item, index)}
            bodyData={latestOrders.body}
            renderBody={(item, index) => renderOrderBody(item, index)}
          />
        )}
      </div>
      {showModalAgregar ? (
        <MyModal
          title="Crea un nuevo Cupon"
          onSubmit={handleSubmit}
          isOpen={true}
          submitText="Aceptar"
          cancelText="Cancelar"
          onClose={() => setShowModalAgregar(false)}
        >
          <form className="form">
            {/* <label htmlFor="">Menús de acceso:</label>
            <Select
              isMulti
              defaultValue=""
              onChange={handleChangeSelect}
              options={options}
            /> */}
            <label htmlFor="name">Nombre del cupon:</label>
            <input
              type="text"
              id="name"
              name="role"
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
              placeholder="useLimitUser"
              onChange={handleChange}
              required
            />
            <label htmlFor="fromAmount">A partir de:</label>
            <input
              type="number"
              id="fromAmount"
              name="fromAmount"
              placeholder="fromAmount"
              onChange={handleChange}
              required
            />
            <label htmlFor="discountType">Tipo de descuento:</label>
            <input
              type="number"
              id="discountType"
              name="discountType"
              placeholder="discountType"
              onChange={handleChange}
              required
            />
            <label htmlFor="discountType">Descuento:</label>
            <input
              type="number"
              id="discountImport"
              name="discountImport"
              placeholder="discountImport"
              onChange={handleChange}
              required
            />
            <label htmlFor="serviceType">Tipo de servicio:</label>
            <input
              type="number"
              id="serviceType"
              name="serviceType"
              placeholder="serviceType"
              onChange={handleChange}
              required
            />
            <label htmlFor="useLimitUser">Cupones a dar:</label>
            <input
              type="number"
              id="useLimitUser"
              name="useLimitUser"
              placeholder="useLimitUser"
              onChange={handleChange}
              required
            />
          </form>
        </MyModal>
      ) : null}
      {showModalEditar ? (
        <MyModal
        title="Edita el Cupon seleccionado"
        onSubmit={handleSubmit}
        isOpen={true}
        submitText="Aceptar"
        cancelText="Cancelar"
        onClose={() => setShowModalEditar(false)}
      >
        <form className="form">
          {/* <label htmlFor="">Menús de acceso:</label>
          <Select
            isMulti
            defaultValue=""
            onChange={handleChangeSelect}
            options={options}
          /> */}
          <label htmlFor="name">Nombre del cupon:</label>
          <input
            type="text"
            id="name"
            name="role"
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
            placeholder="useLimitUser"
            onChange={handleChange}
            required
          />
          <label htmlFor="fromAmount">A partir de:</label>
          <input
            type="number"
            id="fromAmount"
            name="fromAmount"
            placeholder="fromAmount"
            onChange={handleChange}
            required
          />
          <label htmlFor="discountType">Tipo de descuento:</label>
          <input
            type="number"
            id="discountType"
            name="discountType"
            placeholder="discountType"
            onChange={handleChange}
            required
          />
          <label htmlFor="discountType">Descuento:</label>
          <input
            type="number"
            id="discountImport"
            name="discountImport"
            placeholder="discountImport"
            onChange={handleChange}
            required
          />
          <label htmlFor="serviceType">Tipo de servicio:</label>
          <input
            type="number"
            id="serviceType"
            name="serviceType"
            placeholder="serviceType"
            onChange={handleChange}
            required
          />
          <label htmlFor="useLimitUser">Cupones a dar:</label>
          <input
            type="number"
            id="useLimitUser"
            name="useLimitUser"
            placeholder="useLimitUser"
            onChange={handleChange}
            required
          />
        </form>
        </MyModal>
      ) : null}
    </Layout>
  );
};

export default Cupones;
