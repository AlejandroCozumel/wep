import axios from "axios";

export const myAxios = ({ method, url, data }) => {
  const token = localStorage.getItem("weptoken");
  return axios({
    baseURL: `${process.env.NEXT_PUBLIC_WEP_URL}`,
    url,
    method,
    data,
    headers: {
      "token": token,
    },
  });
};