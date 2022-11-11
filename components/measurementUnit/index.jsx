import React, { useState, useEffect } from "react";
import Table from "../table";
import Badge from "../badge";
import { myAxios } from "../../utils/api";

import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyModal from "../modal";
import Swal from "sweetalert2";

const Measures = () => {
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
  });

  const deleteModal = (indexRol) => {
    Swal.fire({
      title: `Quieres eliminar el coupon: ${indexRol.id}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteMeasureMutation.mutate(indexRol);
      } else if (result.isDenied) {
        Swal.fire("Cambios cancelados", "", "info");
      }
    });
  };

  const peticionGetMeasurment = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/measurementUnits`,
    });
    return data;
  };

  const peticionDeleteMeasurment = async (indexRol) => {
    try {
      const { data } = await myAxios({
        method: "delete",
        url: `/measurementUnits/${indexRol.id}`,
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

  const peticionCreateMeasurment = async () => {
    try {
      const { data } = await myAxios({
        method: "post",
        url: `/measurementUnits`,
        data: formData,
      });
      Swal.fire(`Unidad de medida agregada`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      Swal.fire(`error`);
    }
  };

  const peticionUpdateMeasurment = async () => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/measurementUnits/${formData.id}`,
        data: formData,
      });
      Swal.fire(`Cupon ${formData.name} actualizado`, "", "success");
      setIsFetching(false);
      setTimeout(() => {
        setIsFetching(true);
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire(`error`);
    }
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: measurementUnits,
    error,
  } = useQuery(["getmeasurment"], peticionGetMeasurment);

  const DeleteMeasureMutation = useMutation(peticionDeleteMeasurment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getmeasurment");
    },
  });

  const CreateMeasureMutation = useMutation(peticionCreateMeasurment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getmeasurment");
    },
  });

  const UpdateMeasureMutation = useMutation(peticionUpdateMeasurment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getmeasurment");
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    CreateMeasureMutation.mutate();
    setShowModalAgregar(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    UpdateMeasureMutation.mutate();
    setShowModalEditar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeEditId = (item) => {
    setShowModalEditar(true);
    setFormData(item);
  };

  const handleChangeDeleteId = (item) => {
    deleteModal(item);
  };

  const latestOrders = {
    header: ["ID", "Nombre", "Abreviación", , "Status", "Acción"],
    body: measurementUnits?.map((units) => ({
      id: units.id,
      name: units.name,
      abbreviation: units.abbreviation,
      status: units.status.toString(),
    })),
  };

  const handleShowModalAgregar = () => {
    setShowModalAgregar(false);
    setFormData("");
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.abbreviation}</td>
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
          limit={10}
          headData={latestOrders.header}
          renderHead={(item, index) => renderOrderHead(item, index)}
          bodyData={latestOrders.body}
          renderBody={(item, index) => renderOrderBody(item, index)}
        />
      )}
      {showModalAgregar ? (
        <MyModal
          title="Crea una nueva Unidad de medida"
          isOpen={true}
          cancelText="Cancelar"
          onClose={handleShowModalAgregar}
        >
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="name">Nombre de la medida:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
            <label htmlFor="abbreviation">Abreviación:</label>
            <input
              type="text"
              id="abbreviation"
              name="abbreviation"
              placeholder="Abreviación"
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
          title="Edita la Unidad de medida seleccionada"
          isOpen={true}
          cancelText="Cancelar"
          onClose={() => setShowModalEditar(false)}
        >
          <form onSubmit={handleSubmitEdit} className="form">
            <label htmlFor="name">Nombre de la medida:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.name}
              required
            />
            <label htmlFor="abbreviation">Abreviación:</label>
            <input
              type="text"
              id="abbreviation"
              name="abbreviation"
              placeholder="Abreviación"
              value={formData.abbreviation}
              onChange={handleChange}
              required
            />

            <button className="rounded-sm mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none">
              Aceptar
            </button>
          </form>
        </MyModal>
      ) : null}
    </>
  );
};

export default Measures;
