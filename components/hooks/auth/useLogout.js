import Cookies from "js-cookie";
import { useRouter } from 'next/router'

export const useLogout = () => {
  const router = useRouter();
  const logout = () => {
    Cookies.remove("weptoken");
    router.push("/")
  };

  return { logout };
};