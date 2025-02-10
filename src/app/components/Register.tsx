"use client";
import React, { useState, ChangeEvent } from "react";
import { signup } from "@/lib/auth-actions";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { inputChange } from "@/lib/onChange";
const Register = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const onRegister = async (e: ChangeEvent) => {
    e.preventDefault();

    const response = await signup(userInfo);

    console.log(response);
    if (response?.status === 200) {
      Swal.fire({
        title: "Message Sent!",
        text: "Your message was successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setUserInfo({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: response?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className=" pt-5 rounded-lg ">
      <h2 className="w-full text-[#3b5998] text-3xl text-center">Register</h2>
      <form className="bg-[#17114b] text-[#f7f7f7] flex flex-col p-10 gap-6 rounded-lg shadow-lg ">
        <label htmlFor="firstName" className="text-lg font-medium">
          First Name:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#4aa2f2] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          id="firstName"
          name="firstName"
          type="text"
          onChange={(e) => inputChange(e, setUserInfo)}
          required
        />

        <label htmlFor="lastName" className="text-lg font-medium">
          Last Name:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#4aa2f2] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          id="lastName"
          name="lastName"
          type="text"
          onChange={(e) => inputChange(e, setUserInfo)}
          required
        />

        <label htmlFor="email" className="text-lg font-medium">
          Email:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#4aa2f2] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          id="email"
          name="email"
          type="email"
          onChange={(e) => inputChange(e, setUserInfo)}
          required
        />

        <label htmlFor="password" className="text-lg font-medium">
          Password:
        </label>
        <input
          className="text-xl text-[#f7f7f7] p-3 rounded-md bg-transparent border-2 border-[#4aa2f2] focus:outline-none focus:ring-2 focus:ring-[#4aa2f2]"
          id="password"
          name="password"
          type="password"
          onChange={(e) => inputChange(e, setUserInfo)}
          required
        />

        <button
          className="text-white bg-[#4aa2f2] p-3 rounded-md mt-6 hover:bg-[#3a8ccf] transition duration-200"
          type="submit"
          onClick={() => onRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
