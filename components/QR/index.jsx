import React from "react";
import QRCode from "react-qr-code";
import { myAxios } from "../../utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Qr = () => {
  const peticionGetQRCode = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/establishments/getQr`,
    });
    return data;
  };

  const {
    isLoading,
    isError,
    data: qrCode,
    error,
  } = useQuery(["getQR"], peticionGetQRCode);

  const queryClient = useQueryClient();

  const UpdateQRMutation = useMutation(peticionGetQRCode, {
    onSuccess: () => {
      queryClient.invalidateQueries("getQR");
    },
  });

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <div className="card">
      <QRCode value={qrCode.waQr} />
      <button
        style={{ padding: "15px", marginTop: "20px" }}
        className="continuar"
        onClick={() => UpdateQRMutation.mutate()}
      >
        Recargar QR
      </button>
      </div>
    </div>
  );
};

export default Qr;
