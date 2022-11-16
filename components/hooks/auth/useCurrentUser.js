import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useCurrentUser = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const currentUser = Cookies.get("weptoken");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  return user;
};