"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { login } from "@/lib/auth-actions";
import { inputChange } from "@/lib/onChange";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onLogIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await login(credentials);

    if (response?.status == 200) {
      Swal.fire({
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setIsLoading(false);
        router.push("/home?tab=To-Do");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Please check your Credentials",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setIsLoading(false);
      });
    }
  };
  return (
    <div className="pt-5 rounded-lg">
      <h2 className="text-[#17114b] text-3xl text-center">Login</h2>
      <form
        className="bg-[#3b5998] text-[#f7f7f7]  flex flex-col p-10 gap-6 rounded-lg shadow-lg w-full "
        onSubmit={onLogIn}
      >
        <label htmlFor="email" className="text-lg font-medium">
          Email:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          name="email"
          type="email"
          onChange={(e) => inputChange(e, setCredentials)}
          required
        />

        <label htmlFor="password" className="text-lg font-medium">
          Password:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          name="password"
          type="password"
          onChange={(e) => inputChange(e, setCredentials)}
          required
        />

        <button
          className="text-white bg-[#4aa2f2] p-3 rounded-md mt-6 hover:bg-[#3a8ccf] transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing" : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
