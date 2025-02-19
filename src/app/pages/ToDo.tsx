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
    color: condition?.color || "#e9ff70",
  });

  const [selectedButton, setSelectedBUtton] = useState("#e9ff70");
  const buttonColors = ["#e9ff70", "#ffd670", "#ff9770", "#ff70a6", "#70d6ff"];

  const fetchNotes = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const response = await fetchData("notes", { posted_by: user?.id });
    return response;
  };

  const {
    data: savedNotes,
    error,
    isLoading: noteLoading,
  } = useSWR("saved_notes", fetchNotes, {
    refreshInterval: 5000,
  });

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
    setIsLoading(true);
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

      {noteLoading ? (
        <section className="w-[100%] h-[50vh] flex justify-center items-center">
          <Loading />
        </section>
      ) : (
        <section className="h-[80%] p-5 flex flex-row flex-wrap justify-start items-center gap-4">
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
          <div className="flex flex-row flex-wrap border-2 border-black gap-5 p-5">
            {savedNotes?.map((items: any, index: number) => (
              <React.Fragment key={index}>
                <Notes notes={items} index={index} />
              </React.Fragment>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ToDo;
