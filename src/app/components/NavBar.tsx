import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-actions";
import Swal from "sweetalert2";
import { deleteUser } from "@/utils/supabase/deleteUser";
import { createClient } from "@/utils/supabase/client";
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
    "Google-Drive",
    "Food-Review",
    "Pokemon-Review",
    "Markdown",
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
  const deletess = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    Swal.fire({
      title: "Are you sure you want to delete your Account?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(user?.id);

        const response = await deleteUser(user?.id);
        if (response?.status == 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your Accoount has been deleted.",
            icon: "success",
          }).then(async () => {
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
          });
        } else {
          alert(response?.message);
        }
      }
    });
  };
  return (
    <div
      className="

    h-[80px] w-full bg-[#03045e] text-white  flex  justify-center items-center"
    >
      {" "}
      <div>
        <button
          type="button"
          className="text-white ms-5 w-[150px] p-2 border-2 border-[white] rounded-xl"
          onClick={deletess}
        >
          Delete Account
        </button>
      </div>
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
