import React, { useState } from "react";
import { inputChange } from "@/lib/onChange";
import { updateMarkDown } from "@/lib/mark-down";
import Swal from "sweetalert2";
import { deleteData } from "@/utils/deleteDatas";
import { mutate } from "swr";
const MarkDownNotes = ({
  items,
  setIsActiveNote,
  isActiveNote,
}: {
  items: any;
  setIsActiveNote: (res: number) => void;
  isActiveNote: number | null;
}) => {
  const [isEditing, setIsEditing] = useState(items?.title == "" ? true : false);
  const [note, setNote] = useState(items);

  const onUpdate = async (id: number) => {
    const response = await updateMarkDown({
      title: note?.title,
      id: items?.id,
    });
    if (response.status == 200) {
      Swal.fire({
        title: "title has been updated",
        text: "You can now enter a markdown note",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("get_markdown");
        setIsEditing(false);
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
  const onDeleteNote = async (id: number) => {
    const response = await deleteData("mark_down_notes", id);
    if (response?.status == 200) {
      Swal.fire({
        title: "Note has been Deleted",
        text: "Content deleted successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("get_markdown");
      });
    }
  };
  return (
    <div
      className={`flex flex-col gap-2 ] text-white p-3 rounded-lg 
        ${
          isActiveNote == items?.id
            ? "border-2 border-[yellow] bg-[#03045e]"
            : "bg-[#03055e88]"
        }
         cursor-pointer`}
      onClick={() => setIsActiveNote(items?.id)}
    >
      <div className="flex flex-row justify-end gap-x-2 p-1">
        {isEditing ? (
          <>
            <button
              className="border-2 rounded-lg p-2"
              onClick={() => onUpdate(items?.id)}
            >
              Update
            </button>
            <button
              className="border-2 rounded-lg p-2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="border-2 rounded-lg p-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="border-2 rounded-lg p-2"
              onClick={() => onDeleteNote(items?.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
      {!isEditing ? (
        <div>
          <label htmlFor="">Title: </label>
          <div className="text-lg">{note?.title}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <label htmlFor="">Title: </label>
          <input
            type="text"
            name="title"
            className="text-[#03045e] rounded-lg"
            value={note?.title}
            onChange={(e) => {
              inputChange(e, setNote);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MarkDownNotes;
