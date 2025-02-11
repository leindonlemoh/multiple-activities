import React, { useState, useEffect } from "react";
import Notes from "../components/Notes";
import { inputChange } from "@/lib/onChange";
import { addNotes } from "@/lib/todo";
import { createClient } from "@/utils/supabase/client";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
const ToDo = () => {
  const getItems = localStorage.getItem("localNotes");
  const condition = getItems ? JSON.parse(getItems) : [];

  const [noteList, setNoteList] = useState({
    note: condition?.note ? condition?.note : "",
    date: condition?.date ? condition?.date : "",
    color: condition?.color ? condition?.color : "#e9ff70",
  });

  const [savedNotes, setSavedNotes] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedButton, setSelectedBUtton] = useState("#e9ff70");
  const buttonColors = ["#e9ff70", "#ffd670", "#ff9770", "#ff70a6", "#70d6ff"];

  const fetchNotes = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .eq("posted_by", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setSavedNotes(notes);
    setIsLoading(false);
  };

  const onChangeSaved = (e: any) => {
    const { name, value } = e.target;
    setNoteList((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
    localStorage.setItem("localNotes", JSON.stringify(noteList));
    console.log(condition);
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
        fetchNotes();
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
        <form className="w-full h-full flex flex-col p-4 text-center">
          <div className="flex-1 mb-4">
            <div className="border-2 rounded-lg  mb-4">
              <textarea
                name="note"
                id="note"
                cols={40}
                rows={4}
                value={noteList?.note}
                className="w-full p-2 rounded-lg"
                onChange={onChangeSaved}
              ></textarea>
            </div>
            <div>
              <input
                type="date"
                name="date"
                id="date"
                value={new Date(String(condition?.date)).toLocaleDateString(
                  "fr-CA",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
                className="w-[50%]border-2 border-gray-300 p-2 rounded-lg"
                onChange={onChangeSaved}
              />
            </div>
          </div>

          <div className="flex justify-center ">
            <div className="flex w-full justify-center gap-5">
              {buttonColors?.map((color: string, index: number) => (
                <div key={index}>
                  <button
                    type="button"
                    className={`w-12 h-12 rounded-full  border-2 ${
                      selectedButton == `${color}`
                        ? "border-[white]"
                        : "border-black"
                    }`}
                    onClick={() => {
                      setSelectedBUtton(`${color}`);
                      setNoteList((prevNoteList) => ({
                        ...prevNoteList,
                        color: `${color}`,
                      }));
                    }}
                    style={{ background: `${color}` }}
                  ></button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-24 h-10 bg-blue-500 text-white rounded-md"
              onClick={onNoteSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="h-[80%] p-5 flex flex-row flex-wrap justify-center items-center gap-4">
          <Loading />
        </div>
      ) : (
        <div className="h-[80%] p-5 flex flex-row flex-wrap justify-start items-center gap-4">
          <div className="w-full flex flex-row justify-start gap-5 items-center">
            <div className="relative flex items-center">
              <div className="w-8 h-8 bg-[yellow] rotate-45 transform -translate-x-2 -translate-y-2"></div>
              <p className="text-black ml-2">-undone</p>
            </div>
            <div className="relative flex items-center">
              <div className="w-8 h-8 bg-[blue] rotate-45 transform -translate-x-2 -translate-y-2"></div>
              <p className="text-black ml-2">-done</p>
            </div>
          </div>

          {savedNotes.map((items: any, index: number) => {
            return (
              <React.Fragment key={index}>
                <Notes notes={items} index={index} fetch={fetchNotes} />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToDo;
