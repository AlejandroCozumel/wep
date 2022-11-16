import Cookies from "js-cookie";
import { loginService } from "../../../services/auth.service";
import { useRouter } from 'next/router'

export const useLogin = () => {
  const router = useRouter();

  const login = async (dataUser) => {
    const user = await loginService(dataUser);
    if (user) {
      Cookies.set("weptoken", JSON.stringify(user), {expires:7});
      return router.push("dashboard")
    }
    return alert("Usuario No encontrado");
  };

  return { login };
};