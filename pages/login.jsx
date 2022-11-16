import Image from "next/image";
import React, { useState } from "react";
import { useLogin } from "../components/hooks/auth/useLogin";
import LandingLayout from "../components/landingLayout";

const Login = () => {

  const [user, setUser] = useState({ email: "", password: "" });
  const { login } = useLogin();


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Porfavor Rellena todos los campos");
    } else {
      login(user);
    }

  };

  return (
    <LandingLayout>
      <div className="grid w-full min-h-[90vh] grid-cols-1 gap-2 p-2 lg:grid-cols-2 my-4">
        <div href="#" className="hidden lg:flex flex-col items-center justify-center border rounded-lg shadow-md md:flex-row bg-[#349eff]" >
          <img className="object-cover w-auto rounded-t-lg h-[90vh] md:rounded-none md:rounded-l-lg" src="/login.png" alt="Cover login" />
        </div>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Inicia sesión con tu cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                  
                >
                  Tu correo
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                  placeholder="tunombre@tudominio.com"
                  required
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                  required
                />
              </div>
              <div className="flex justify-end">

                <a
                  href="#"
                  className="text-sm font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#349eff] "
              >
                Iniciar Sesión
              </button>
              <p className="text-sm font-light text-gray-500 ">
                ¿No tienes una cuenta?{" "}
                <a
                  href="#"
                  className="font-medium hover:underline "
                >
                  Registrate
                </a>
              </p>
            </form>
          </div>
        </div>

      </div>
    </LandingLayout>
  );
};

export default Login;
