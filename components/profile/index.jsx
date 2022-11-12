import React, { useState } from "react";
import { myAxios } from "../../utils/api";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Swal from "sweetalert2";

import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const [formData, setFormData] = useState("projects");
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({});

  const baseUrl = "https://api.wep.mx/";

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
    setLng(data.longitude);
    setLat(data.latitude);
    return data;
  };

  const peticionUpdateIndividualProducts = async () => {
    try {
      const { data } = await myAxios({
        method: "put",
        url: `/establishments`,
        data: {
          ...formData,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          logo: null,
          promotionalImg: null,
        },
      });
      Swal.fire(
        `El establecimiento ${formData.establishmentName} ha sido actualizado con exito`,
        "",
        "success"
      );
      return data;
    } catch (error) {
      Swal.fire(
        `Error al actualizar el establecimiento ${formData.establishmentName}`,
        "",
        "warning"
      );
    }
  };

  const { data: user } = useQuery({
    queryKey: ["getProfile"],
    queryFn: peticionGetProfile,
  });

  const userId = user?.establishmentId;
  const queryClient = useQueryClient();

  const UpdateEstablishmentMutation = useMutation(
    peticionUpdateIndividualProducts,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getProfile");
      },
    }
  );

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

  console.log("location", lng, lat);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdateEstablishmentMutation.mutate();
  };

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };
  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  //Add image to handle submit
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setFormData({ ...formData, logo: base64 });
  // };

  // const handleFileUploadEdit = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   setIdProduct({ ...idProduct, image: base64 });
  // };

  return (
    <div className="card">
      <ReactMapGL
        mapboxAccessToken="pk.eyJ1IjoibXJsYWNjIiwiYSI6ImNrZmZ3ZnN4cDBpdmYydG5tY3d6bTMxZHgifQ.OGctk_czFi2Hr5QE4Qfmiw"
        style={{
          width: "100%",
          height: "400px",
        }}
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          latitude={currentLocation?.latitude ? currentLocation?.latitude : lat}
          longitude={
            currentLocation?.longitude ? currentLocation?.longitude : lng
          }
          draggable
          onDragEnd={(e) =>
            setCurrentLocation({
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
            })
          }
        />
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation
          showUserLocation={false}
          onGeolocate={(e) =>
            setCurrentLocation({
              longitude: e.coords.longitude,
              latitude: e.coords.latitude,
            })
          }
        />
      </ReactMapGL>
      <br />
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
              <label htmlFor="description">Logo:</label>
              <input
                type="file"
                label="Image"
                name="image"
                accept=".jpeg, .png, .jpg"
                // required
                // onChange={handleFileUpload}
              />
              <Image
                src={`${baseUrl}${formData.logo}`}
                alt="logo"
                width={45}
                height={45}
              />
            </div>
            <div className="flex-column">
              <label htmlFor="description">Imagen promocional:</label>
              <input
                type="file"
                label="Image"
                name="image"
                accept=".jpeg, .png, .jpg"
                // required
                // onChange={handleFileUpload}
              />
              <Image
                src={`${baseUrl}${formData.promotionalImg}`}
                alt="logo"
                width={45}
                height={45}
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
