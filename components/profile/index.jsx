import React, { useState } from "react";
import { myAxios } from "../../utils/api";

import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const [formData, setFormData] = useState("projects");

  const peticionGetProfile = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/user/profile`,
    });
    return data;
  };

  const peticionGetEstablishmentProfile = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/establishments/${userId}`,
    });
    setFormData(data);
    return data;
  };

  const { data: user } = useQuery({
    queryKey: ["getProfile"],
    queryFn: peticionGetProfile,
  });

  const userId = user?.establishmentId;

  const {
    status,
    // fetchStatus,
    data: establishment,
  } = useQuery({
    queryKey: ["getProfile", peticionGetProfile],
    queryFn: peticionGetEstablishmentProfile,
    // The query will not execute until the userId exists
    enabled: !!userId,
  });

  if (status === "loading") {
    return <div className="loading-spinner"></div>;
  }

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("alert");
  }

  return (
    <div className="card">
    <div className="profile">
      <form onSubmit={handleSubmit} className="form">
        <div className="grid">
          <div className="flex-column">
            <label htmlFor="name">Nombre del establecimiento:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              required
              value={formData?.name}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="state">Estado:</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="Estado"
              onChange={handleChange}
              required
              value={formData?.state}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="city">Ciudad:</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ciudad"
              onChange={handleChange}
              required
              value={formData?.city}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="phone">Telefono:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              placeholder="# Telefono"
              onChange={handleChange}
              required
              value={formData?.phone}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="costHomeService">Costo del envio:</label>
            <input
              type="number"
              id="costHomeService"
              name="costHomeService"
              placeholder="$ envio"
              onChange={handleChange}
              required
              value={formData?.costHomeService}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="extendHomeService">
              Costo del envio extendido:
            </label>
            <input
              type="number"
              id="extendHomeService"
              name="extendHomeService"
              placeholder="$ envio extendido"
              onChange={handleChange}
              required
              value={formData?.extendHomeService}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="address">Direccion:</label>
            <textarea
              rows={3}
              id="address"
              name="address"
              placeholder="Direccion"
              onChange={handleChange}
              required
              value={formData?.address}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="description">Descripcion:</label>
            <textarea
              rows={3}
              id="description"
              name="description"
              placeholder="Descripcion"
              onChange={handleChange}
              required
              value={formData?.description}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="description">Selecciona una imagen:</label>
            <input
              type="file"
              label="Image"
              name="myFile"
              accept=".jpeg, .png, .jpg"
              // required
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="rounded-sm mt-4 px-4 py-4 text-sm font-medium bg-gray-400 text-gray-200 hover:bg-green-600 hover:text-gray-200 focus:outline-none">
          Aceptar
        </button>
      </form>
    </div>
    </div>
  );
};

export default Profile;
