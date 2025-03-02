import React, { useState, useEffect } from "react";
import Notes from "../components/Notes";
import { addNotes } from "@/lib/todo";
import { createClient } from "@/utils/supabase/client";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import { fetchData } from "@/utils/fetchData";
import useSWR, { mutate } from "swr";
import AddNotesForm from "../components/AddNotesForm";
const ToDo = () => {
  const getItems = localStorage.getItem("localNotes");
  const condition = getItems ? JSON.parse(getItems) : [];
  const [isLoading, setIsLoading] = useState(false);
  const [noteList, setNoteList] = useState({
    note: condition?.note || "",
    date: condition?.date || "",
    priority: condition?.priority || "LOW",
    color: condition?.color || "#e9ff70",
  });

  const [selectedButton, setSelectedBUtton] = useState("#e9ff70");
  const buttonColors = ["#e9ff70", "#ffd670", "#ff9770", "#ff70a6", "#70d6ff"];

  const onChangeSaved = (e: any) => {
    const { name, value } = e.target;
    setNoteList((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("localNotes", JSON.stringify(noteList));
    console.log(noteList);
  }, [noteList]);

  const onNoteSubmit = async (e: any) => {
    e.preventDefault();
    if (noteList?.note === "" || noteList?.date === "") {
      Swal.fire({
        title: "Please Fill Out Text Area and date",
        text: "You can pick a date by clicking its icon",
        icon: "info",
        confirmButtonText: "OK",
      });
    } else {
      const response = await addNotes(noteList);
      setIsLoading(true);
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "New Note has been added",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setIsLoading(false);
          mutate("saved_notes");
          setNoteList({
            note: "",
            date: "",
            priority: "",
            color: "#e9ff70",
          });
        });
      }
    }
  };

  return (
    <div className="h-[91vh] p-5 flex flex-col">
      <div className="h-[50%] border-2 border-b-black text-black relative">
        <AddNotesForm
          isLoading={isLoading}
          noteList={noteList}
          onChangeSaved={onChangeSaved}
          buttonColors={buttonColors}
          onNoteSubmit={onNoteSubmit}
          selectedButton={selectedButton}
          setSelectedBUtton={setSelectedBUtton}
        />
      </div>

      <section className="h-[80%] w-[100%]  flex-wrap justify-start items-center gap-4">
        <div className="w-full flex flex-row p-3 justify-start mb-2 gap-5 items-center">
          <div className="relative flex items-center">
            <div className="w-8 h-8 bg-[yellow] rotate-45 transform -translate-x-2 -translate-y-2"></div>
            <p className="text-black ml-2">-undone</p>
          </div>
          <div className="relative flex items-center">
            <div className="w-8 h-8 bg-[blue] rotate-45 transform -translate-x-2 -translate-y-2"></div>
            <p className="text-black ml-2">-done</p>
          </div>
        </div>

        <Notes />
      </section>
    </div>
  );
};

export default ToDo;
