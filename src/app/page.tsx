"use client";
import { useEffect } from "react";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import { getUser } from "@/lib/getUser";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();

      if (userData) {
        router.push("/home?tab=To-Do");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="p-2">
      <h1 className="text-3xl text-center text-[#17114b]">
        Welcome to Multiple Application
      </h1>
      <div className="w-auto p-4 flex justify-center flex-row gap-4">
        <div className="w-[50%]">
          <Login />
        </div>
        <div className="w-[50%]">
          <Register />
        </div>
      </div>
    </div>
  );
}
