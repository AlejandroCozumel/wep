import axios from "axios";
import Cookies from "js-cookie";

export const myAxios = ({ method, url, data }) => {
  const user = Cookies.get("weptoken");
  const dataUser = JSON.parse(user)
  return axios({
    baseURL: `${process.env.NEXT_PUBLIC_WEP_URL}`,
    url,
    method,
    data,
    headers: {
      "token": dataUser.data.token,
    },
  });
};