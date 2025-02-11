import React, { useState, useEffect } from "react";
import { inputChange } from "@/lib/onChange";
import { updateNote, deleteNote } from "@/lib/todo";
import Swal from "sweetalert2";

const Notes = ({
  notes,
  index,
  fetch,
}: {
  notes: any;
  index: number;
  fetch: () => void;
}) => {
  const date = new Date(notes?.expiration_date);
  const expiration_date = date.toLocaleDateString("en-GB");

  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(notes);
  const onEdit = (params: boolean) => {
    setIsEditing(!params);
  };

  const onUpdate = async (e: any) => {
    e.preventDefault();
    const response = await updateNote(note);
    if (response?.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your note has been updated",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        fetch();
      });
    }
  };

  const onDelete = async (e: any, id: number) => {
    e.preventDefault();
    const response = await deleteNote(id);

    if (response?.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your note has been deleted",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        fetch();
      });
    }
  };
  const onMarkDone = async (e: any) => {
    e.preventDefault();
    const updateStatus = {
      ...notes,
      is_done: !notes?.is_done,
    };
    const response = await updateNote(updateStatus);
    if (response?.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `You Maked this Note ${notes?.is_done ? "UnDone" : "Done"}`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        fetch();
      });
    }
  };

  return (
    <div
      className={`relative p-7 rounded-lg shadow-lg w-[20%] h-60 flex flex-col justify-between`}
      style={{ backgroundColor: notes?.color }}
    >
      <div
        className={`absolute top-0 left-0 w-8 h-8 rotate-45 transform -translate-x-2 -translate-y-2`}
        style={{ background: `${notes?.is_done ? "yellow" : "blue"}` }}
      ></div>
      <h3 className="font-semibold text-xl text-gray-800 mb-2">Note</h3>
      {isEditing && (
        <button
          className="text-blue-500 text-sm hover:underline"
          onClick={(e) => {
            onEdit(isEditing);
          }}
        >
          Cancel
        </button>
      )}
      <textarea
        name="note"
        id="note"
        cols={40}
        rows={4}
        className={` p-3  rounded-lg text-gray-700 
          ${isEditing ? "border-2" : "border-none cursor-not-allowed"}`}
        style={{ background: `${notes?.color}` }}
        disabled={!isEditing}
        value={note?.note}
        onChange={(e) => inputChange(e, setNote)}
      ></textarea>

      <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
        {expiration_date}
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        {notes?.is_done == false ? (
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={onMarkDone}
          >
            Mark Done
          </button>
        ) : (
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={onMarkDone}
          >
            Mark UnDone
          </button>
        )}
        {!isEditing ? (
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => onEdit(isEditing)}
          >
            Edit
          </button>
        ) : (
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={(e) => {
              onEdit(isEditing);
              onUpdate(e);
            }}
          >
            Update
          </button>
        )}
        <button
          className="text-red-500 text-sm hover:underline"
          onClick={(e) => {
            onDelete(e, notes?.id);
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Notes;
// setNoteList((prevNoteList) => ({
//   ...prevNoteList,
//   color: `${color}`,
// }));
