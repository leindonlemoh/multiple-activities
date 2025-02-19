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

  const [noteList, setNoteList] = useState({
    note: condition?.note ? condition?.note : "",
    date: condition?.date ? condition?.date : "",
    color: condition?.color ? condition?.color : "#e9ff70",
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
    isLoading,
  } = useSWR("saved_notes", fetchNotes, {
    refreshInterval: 10000,
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
  }, [noteList]);

  const onNoteSubmit = async (e: any) => {
    e.preventDefault();
    const response = await addNotes(noteList);
    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "New Note has been added",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("saved_notes");
        setNoteList({
          note: "",
          date: "",
          color: "#e9ff70",
        });
      });
    }
  };

  return (
    <div className="h-[91vh] p-5 flex flex-col ">
      <div className="h-[50%] border-2 border-b-black text-black relative">
        <AddNotesForm
          noteList={noteList}
          onChangeSaved={onChangeSaved}
          condition={condition}
          buttonColors={buttonColors}
          onNoteSubmit={onNoteSubmit}
          selectedButton={selectedButton}
          setSelectedBUtton={setSelectedBUtton}
          setNoteList={setNoteList}
        />
      </div>

      {isLoading ? (
        <section className="w-[100%] h-[50vh] flex justify-center items-center ">
          <Loading />
        </section>
      ) : (
        <section>
          <div className="h-[80%] p-5 flex flex-row flex-wrap justify-start items-center gap-4">
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

            {savedNotes?.map((items: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  <Notes notes={items} index={index} />
                </React.Fragment>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ToDo;
