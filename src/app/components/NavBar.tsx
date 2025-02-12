import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-actions";
import Swal from "sweetalert2";

const NavBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (res: string) => void;
}) => {
  const router = useRouter();
  const tabs = [
    "To-Do",
    // ,
    // 'Google-Drive'
    "Food-Review",
    "Pokemon-Review",
    // ,'Markdown'
  ];

  const onLogout = async () => {
    const response = await logout();

    if (response?.status == 200) {
      Swal.fire({
        title: "Logged Out",
        text: response.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push("/");
      });
    }
  };

  return (
    <div
      className="

    h-[80px] w-full bg-[#03045e] text-white  flex  justify-center items-center"
    >
      <div className=" w-full m-1 p-[5px]">
        <ol
          className="
            sm:gap-[20px]
            md:gap-[30px]
            lg:gap-[40px]
            flex flex-row items-center justify-center gap-4 
            "
        >
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                className={`w-auto text-[#80ed99] text-lg p-2
                sm:w-[120px] sm:text-sm
                md:text-lg
                lg:text-xl
         

            ${activeTab == tab ? "border-2 border-[#00b4d8] rounded-xl" : ""}
                `}
                onClick={() => {
                  setActiveTab(tab), router.push(`?tab=${tab}`);
                }}
              >
                {tab}
              </button>
            </li>
          ))}

          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default NavBar;
