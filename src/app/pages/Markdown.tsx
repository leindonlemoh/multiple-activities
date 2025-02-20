import React, { useState, useEffect } from "react";
import MarkDownNotes from "../components/MarkDownNotes";
import { addMarkDown, updateMarkDown } from "@/lib/mark-down";
import { getUser } from "@/lib/getUser";
import { fetchData } from "@/utils/fetchData";
import Swal from "sweetalert2";
import useSWR, { mutate } from "swr";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { deleteData } from "@/utils/deleteDatas";
import Loading from "../components/Loading";

const MarkdownApp = () => {
  const [input, setInput] = useState<string>("");
  const [isActiveNote, setIsActiveNote] = useState<number | null>(null);

  const getMarkDowns = async () => {
    const userData = await getUser();
    const data = await fetchData("mark_down_notes", {
      posted_by: userData?.id,
    });
    return data || [];
  };

  const {
    data: savedNotes,
    error,
    isLoading,
  } = useSWR("get_markdown", getMarkDowns, {
    refreshInterval: 10000,
  });

  const addMarkDownNotes = async () => {
    const response = await addMarkDown();

    if (response.status == 200) {
      mutate("get_markdown");
    } else {
      Swal.fire({
        title: "Something Went Wrong!",
        text: "Try it later",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onUpdateMarkdown = async (id: number) => {
    const response = await updateMarkDown({
      content: input,
      id: id,
    });
    if (response.status == 200) {
      Swal.fire({
        title: "Content has been updated",
        text: "Content updated successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("get_markdown");
      });
    } else {
      Swal.fire({
        title: "Something Went Wrong!",
        text: "Try it later",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    if (isActiveNote !== null) {
      const activeNote = savedNotes?.find(
        (note: any) => note.id === isActiveNote
      );
      if (activeNote) {
        setInput(activeNote.content);
      }
    }
  }, [isActiveNote, savedNotes]);

  return (
    <div className="flex flex-row bg-[#c4c4c4a4] w-[100%] h-[100vh] border-2">
      {/* title tabs */}
      <div className="p-4 border-2 w-[20%] flex flex-col gap-y-3">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <h3 className="text-[#03045e] text-3xl text-center">Saved Notes</h3>
            <button
              className="bg-[#03045e] text-6xl rounded-lg text-center text-white"
              onClick={addMarkDownNotes}
            >
              <p>+</p>
            </button>
            {savedNotes?.map((items: any, index: number) => {
              return (
                <div key={items.id}>
                  <MarkDownNotes
                    items={items}
                    setIsActiveNote={setIsActiveNote}
                    isActiveNote={isActiveNote}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* text area */}
      <div className="w-[40%]">
        {isActiveNote !== null && savedNotes ? (
          <div className="w-[100%] h-[70vh] p-2 flex-col">
            {savedNotes[isActiveNote]?.content !== input && (
              <button
                className="bg-[#03045e] text-white text-2xl p-3 rounded-lg"
                onClick={() => onUpdateMarkdown(isActiveNote)}
              >
                Save
              </button>
            )}
            <textarea
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-2 border-black h-full w-[100%] text-2xl text-black"
            />
          </div>
        ) : (
          <div>Select a note to edit</div>
        )}
      </div>

      {/* markdown preview */}
      <div className="p-4 w-[40%]">
        {isActiveNote !== null && savedNotes ? (
          <div className="p-4 w-[100%] overflow-auto max-h-[80vh]">
            <ReactMarkdown
              className="p-4 border-2 border-gray-300"
              remarkPlugins={[remarkGfm]}
            >
              {input}
            </ReactMarkdown>
          </div>
        ) : (
          <div>Select a note to preview</div>
        )}
      </div>
    </div>
  );
};

export default MarkdownApp;
