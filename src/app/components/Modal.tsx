import React, { ReactNode } from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  px,
  pb,
  bg,
  // minH = "min-h-[80%]",
  minH,
  w,
  modalBox,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  px?: string;
  pb?: string;
  bg?: string;
  minH?: string;
  w?: string;
  modalBox?: string;
}) => {
  return (
    <div>
      <main
        className={`page-web modal overscroll-contain h-[auto] focus:overscroll-contain fixed z-[100] bg-black bg-opacity-60 inset-0 fade-in 
      lg:flex lg:justify-center lg:items-center
      `}
      >
        <div
          onClick={() => onClose()}
          className="flex flex-1 h-full w-full absolute"
        ></div>

        <section
          className={`flex flex-col ${minH} rounded-[10px] ${w} h-[auto] relative bottom-0 ${
            bg != null ? bg : "bg-white"
          } 
          ${isOpen ? "animate-slide-up" : `animate-slide-down`}

          `}
        >
          <div className="absolute top-[0] right-[0] flex justify-end z-[1]">
            <button
              className="flex justify-center items-center w-[30px] h-[30px] rounded-[50%] bg-white bg-transparent hover:rounded-[50%] active:rounded-[50%] p-5 mr-1 text-black text-4xl"
              onClick={() => {
                onClose();
              }}
            >
              &times;
            </button>
          </div>

          <div className={`modal-box overflow-y-auto ${modalBox}`}>
            <div
              className={`modal-con ${
                px || "px-vw-35px lg:pb-vw-10px"
              } w-full ${pb || "pb-vw-31px lg:pb-vw-10px"}`}
            >
              <article
                className="w-full flex flex-col space-y-6  h-full justify-center 
            max-lg:justify-start"
              >
                {children}
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Modal;
