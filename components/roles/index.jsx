import React, { useState, useEffect } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";

import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyModal from "../modal";
import Swal from "sweetalert2";

const options = [
  { value: 9, label: "measurementUnits" },
  { value: 11, label: "promotions" },
  { value: 12, label: "history" },
  { value: 13, label: "packages" },
  { value: 15, label: "billing" },
  { value: 1, label: "roles" },
  { value: 3, label: "store" },
  { value: 5, label: "coupons" },
  { value: 6, label: "user" },
  { value: 7, label: "establishments" },
  { value: 8, label: "orders" },
];

const Roles = () => {
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState("");

  const deleteModal = (indexRol) => {
    Swal.fire({
      title: `Quieres eliminar el rol: ${indexRol.id}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteRoleMutation.mutate(indexRol);
      } else if (result.isDenied) {
        Swal.fire("Cambios cancelados", "", "info");
      }
    });
  };

  const peticionGetRol = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/roles`,
    });
    return data;
  };

  const peticionDeleteRol = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "delete",
        url: `/roles/${indexRol.id}`,
      });
      Swal.fire(`producto ${indexRol.role} eliminado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const peticionUpdateRol = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/roles/${indexRol.id}`,
        data: indexRol,
      });
      Swal.fire(`El rol ${indexRol.role} ha sido actualizado`, "", "success");
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
    data: userRol,
    error,
  } = useQuery(["getrol"], peticionGetRol);

  const DeleteRoleMutation = useMutation(peticionDeleteRol, {
    onSuccess: () => {
      queryClient.invalidateQueries("getrol");
    },
  });

  const CreateRoleMutation = useMutation(peticionCreateRol, {
    onSuccess: () => {
      queryClient.invalidateQueries("getrol");
    },
  });

  const UpdtaeRoleMutation = useMutation(peticionUpdateRol, {
    onSuccess: () => {
      queryClient.invalidateQueries("getrol");
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

  const handleSubmitEditar = (e) => {
    e.preventDefault();
    setShowModalEditar(false);
    UpdtaeRoleMutation.mutate(formData);
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
    deleteModal(item);
  };

  const handleShowModalAgregar = () => {
    setShowModalAgregar(false);
    setFormData("");
  };

  const latestOrders = {
    header: ["ID", "Rol", "Descripción", "Tipo", "Status", "Acción"],
    body: userRol?.map((rol) => ({
      id: rol.id,
      role: rol.role,
      description: rol.description,
      tipo: rol.type,
      status: rol.status.toString(),
      accion: "accion",
      select: rol.menuItems,
    })),
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.role}</td>
      <td>{item.description}</td>
      <td>{item.tipo}</td>
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
        <div className="card">
          <Table
            limit={5}
            headData={latestOrders.header}
            renderHead={(item, index) => renderOrderHead(item, index)}
            bodyData={latestOrders.body}
            renderBody={(item, index) => renderOrderBody(item, index)}
          />
        </div>
      )}
      {showModalAgregar ? (
        <MyModal
          title="Crea un nuevo rol"
          isOpen={true}
          cancelText="Cancelar"
          onClose={handleShowModalAgregar}
        >
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="">Menús de acceso:</label>
            <Select
              isMulti
              defaultValue=""
              onChange={handleChangeSelect}
              options={options}
            />
            <label htmlFor="role">Nombre del rol:</label>
            <input
              type="text"
              id="role"
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
              placeholder="Description"
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
          title="Edita los roles al usuario seleccionado"
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalEditar(false)}
        >
          <form onSubmit={handleSubmitEditar} className="form">
            <label htmlFor="">Menús de acceso:</label>
            <Select
              isMulti
              defaultValue={formData.select.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onChange={handleChangeSelect}
              options={options}
            />
            <label htmlFor="role">Nombre del rol:</label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Nombre"
              onChange={handleChange}
              required
              value={formData.role}
            />
            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
              value={formData.description}
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

export default Roles;
