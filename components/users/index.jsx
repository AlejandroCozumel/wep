import React, { useState } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";
import { Switch } from "@headlessui/react";

import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyModal from "../modal";
import Swal from "sweetalert2";

const Users = () => {
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState("");
  const [isUserActive, setIsUserActive] = useState(false);

  const deleteModal = (indexRol) => {
    Swal.fire({
      title: `Quieres eliminar al usuario: ${indexRol.id}?`,
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

  const peticionGetUsers = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/user`,
    });
    return data;
  };

  const peticionGetRole = async () => {
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
        url: `/user/${indexRol.id}`,
      });
      Swal.fire(`usuario ${indexRol.name} eliminado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const peticionUpdateUser = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/user/${indexRol.id}`,
        data: {
          name: indexRol.name,
          email: indexRol.email,
          status: indexRol.status,
        },
      });
      Swal.fire(
        `El usuario ${indexRol.name} ha sido actualizado`,
        "",
        "success"
      );
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      Swal.fire(error.response.data.message);
    }
  };

  const peticionCreateUser = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/user`,
        data: formData,
      });
      Swal.fire(`Usuario ${formData.name} agregado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      Swal.fire(error.response.data.message);
    }
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: user,
    error,
  } = useQuery(["getUser"], peticionGetUsers);

  const { data: roles } = useQuery(["getUserRole"], peticionGetRole);

  const DeleteRoleMutation = useMutation(peticionDeleteRol, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  const CreateUserMutation = useMutation(peticionCreateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  const UpdateUserMutation = useMutation(peticionUpdateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleSubmit = () => {
    CreateUserMutation.mutate();
    setShowModalAgregar(false);
  };

  const handleSubmitEditar = (e) => {
    e.preventDefault();
    setShowModalEditar(false);
    UpdateUserMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      status: false,
    }));
  };

  const handleChangeSelect = (e) => {
    setFormData({ ...formData, roleId: e.value });
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

  const handleShowModalEditar = () => {
    setShowModalEditar(false);
    setFormData("");
  };

  const handleChangeActive = () => {
    setIsUserActive(!isUserActive);
    setFormData({ ...formData, status: !isUserActive });
  };

  const latestOrders = {
    header: ["ID", "Nombre", "Correo", "Rol", "Status", "Acción"],
    body: user?.map((users) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role.role,
      status: users.status,
      accion: "accion",
    })),
  };

  console.log(user);
  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.role}</td>
      <td>
        <Badge
          type={item.status === true ? "success" : "danger"}
          content={item.status === true ? "Activo" : "Inactivo"}
        />
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
          title="Crea un nuevo usuario"
          isOpen={true}
          cancelText="Cancelar"
          onClose={handleShowModalAgregar}
        >
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="">Menús con acceso:</label>
            <Select
              defaultValue=""
              onChange={handleChangeSelect}
              options={roles?.map((item) => ({
                value: item.id,
                label: item.role,
              }))}
            />
            <label htmlFor="name">Nombre del usuario:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email del usuario:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
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
          title="Edita al usuario seleccionado"
          isOpen={true}
          cancelText="Cancelar"
          onClose={handleShowModalEditar}
        >
          <form onSubmit={handleSubmitEditar} className="form">
            <label htmlFor="">Menús de acceso:</label>
            <Select
              defaultValue={{
                label: formData.role,
                value: formData.id,
              }}
              onChange={handleChangeSelect}
              options={roles?.map((item) => ({
                value: item.id,
                label: item.role,
              }))}
            />
            <label htmlFor="name">Nombre del usuario:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
              value={formData.name}
            />
            <label htmlFor="email">Email del usuario:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              required
              value={formData.email}
            />
            <Switch
              checked={isUserActive}
              onChange={handleChangeActive}
              className={`${isUserActive ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${isUserActive ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <button className="rounded-sm mt-3 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      ) : null}
    </>
  );
};

export default Users;
