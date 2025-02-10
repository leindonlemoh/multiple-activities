"use client";
import React, { useState, useEffect } from "react";
import ToDo from "../pages/ToDo";
import GoogleDrive from "../pages/GoogleDrive";
import FoodReview from "../pages/FoodReview";
import PokemonReview from "../pages/PokemonReview";
import Markdown from "../pages/Markdown";
import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import AddPokemon from "../components/AddPokemon";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser } from "@/lib/getUser";
import Modal from "../components/Modal";
import Reviews from "../components/Reviews";

const modalContent = ({
  type,
  onClose,
  onSetModalStatus,
  selectedContent,
  from,
  isModalOpen,
}: {
  type: string;
  onClose: (x?: string) => void;
  onSetModalStatus: (
    x: string,
    selectedContent?: number,
    from?: string
  ) => void;
  selectedContent?: any;
  from?: string;
  isModalOpen?: boolean;
}) => {
  switch (type) {
    case "AddFood":
      return <AddItem onClose={onClose} from={"food"} />;
    case "AddPokemon":
      return <AddItem onClose={onClose} from={"pokemon"} />;
    case "AddReview":
      return <Reviews onClose={onClose} selectedContent={selectedContent} />;
  }
};
const page = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("to-do");
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    type: string;
    selectedContent?: any;
    from?: string;
  }>({
    isOpen: false,
    type: "",
    selectedContent: "",
    from: "",
  });

  const handleModalOpen = async (
    type: string,
    selectedContent?: any,
    from?: string
  ) => {
    setModalStatus({
      isOpen: true,
      type: type,
      from: from,
      selectedContent: selectedContent || "",
    });

    setIsOpen(true);
  };

  const handleModalClose = () => {
    setModalStatus({
      isOpen: false,
      type: modalStatus?.type,
      selectedContent: "",
    });
    setTimeout(() => {
      setIsOpen(false);
      setModalStatus({
        isOpen: false,
        type: "",
        selectedContent: "",
      });
    }, 290);
  };

  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();

      if (!userData) {
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  const onShow = (activeTab: string) => {
    switch (activeTab) {
      case "To-Do":
        return <ToDo />;
      case "Google-Drive":
        return <GoogleDrive />;
      case "Food-Review":
        return (
          <FoodReview
            AddItem={() => handleModalOpen("AddFood")}
            AddReview={handleModalOpen}
          />
        );
      case "Pokemon-Review":
        return (
          <PokemonReview
            AddItem={() => handleModalOpen("AddPokemon")}
            AddReview={handleModalOpen}
          />
        );
      case "Markdown":
        return <Markdown />;
      default:
        return <div>Loading.....</div>;
    }
  };

  return (
    <div>
      <NavBar activeTab={currentTab} setActiveTab={setCurrentTab} />
      {currentTab && onShow(currentTab)}
      {isOpen && (
        <Modal
          key={`modal-${modalStatus?.type}`}
          isOpen={modalStatus?.isOpen}
          onClose={handleModalClose}
          px={"px-[10px]"}
          pb={"pb-[0px] "}
          minH={"min-h-[400px]"}
          w={"w-[auto]"}
        >
          {modalContent({
            type: modalStatus?.type || "",
            onClose: handleModalClose,
            onSetModalStatus: handleModalOpen,
            selectedContent: modalStatus?.selectedContent,
            from: modalStatus?.from,
            isModalOpen: modalStatus?.isOpen,
          })}
        </Modal>
      )}
    </div>
  );
};

export default page;
