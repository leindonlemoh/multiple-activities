import React, { useState, useEffect } from "react";
import { updateNote } from "@/lib/todo";
import Swal from "sweetalert2";
import { fetchData } from "@/utils/fetchData";
import { deleteData } from "@/utils/deleteDatas";
import { createClient } from "@/utils/supabase/client";
import useSWR, { mutate } from "swr";

const Notes = () => {
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

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null); // Track which note is being edited
  const [updatedNotes, setUpdatedNotes] = useState(savedNotes || []);

  // Use Effect to sync initial savedNotes to updatedNotes when savedNotes changes
  useEffect(() => {
    if (savedNotes) {
      setUpdatedNotes(savedNotes);
    }
  }, [savedNotes]);

  const onEdit = (id: number) => {
    setEditingNoteId(id); // Set the note to edit
  };

  const onUpdate = async (id: number, noteContent: string, priority:string) => {
    const updatedNote = {
      id,
      note: noteContent,
      priority: priority,
    };

    const response = await updateNote(updatedNote); // Update the note
    if (response?.status === 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your note has been updated",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("saved_notes");
      });
      setEditingNoteId(null); // Reset editing mode after updating
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error on updating",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onDelete = async (e: any, id: number) => {
    e.preventDefault();
    const response = await deleteData("notes", id);

    if (response?.status === 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your note has been deleted",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("saved_notes");
      });
    }
  };

  const handleChange = (e: any, id: number, from:string) => {
 if(from =='note'){ const updatedNotesList = updatedNotes.map((item) =>
      item.id === id ? { ...item, note: e.target.value } : item
    );
    setUpdatedNotes(updatedNotesList);
  }else if(from == 'priority'){
const updatedNotesList = updatedNotes.map((item) =>
      item.id === id ? { ...item, priority: e.target.value } : item
    );
    setUpdatedNotes(updatedNotesList);
  }
  };

  const onMarkDone = async (e: any, id: number, is_done: boolean) => {
    const updateStatus = {
      id: id,
      is_done: is_done == true ? false : true,
    };
    const response = await updateNote(updateStatus);
    if (response?.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your note has been updated",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("saved_notes");
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Problem on editing",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="flex flex-row flex-wrap border-2 border-black gap-5 p-5">
      {updatedNotes?.map((items: any, index: number) => {
        const date = new Date(items?.expiration_date);
        const expiration_date = date.toLocaleDateString("en-GB");
        const isCurrentNoteEditing = items.id === editingNoteId;

        return (
          <div
            className={`relative p-7 rounded-lg shadow-lg w-[20%] h-60 flex flex-col justify-between`}
            style={{ backgroundColor: items?.color }}
            key={index}
          >
            <div
              className={`absolute top-0 left-0 w-8 h-8 rotate-45 transform -translate-x-2 -translate-y-2`}
              style={{ background: `${items?.is_done ? "blue" : "yellow"}` }}
            ></div>
            <h3 className="font-semibold text-xl text-gray-800 mb-2">Note</h3>

            {isCurrentNoteEditing && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => setEditingNoteId(null)} // Cancel edit mode
              >
                Cancel
              </button>
            )}

            <textarea
              name="note"
              id="note"
              cols={40}
              rows={4}
              className={`p-3 rounded-lg text-gray-700 ${
                isCurrentNoteEditing
                  ? "border-2"
                  : "border-none cursor-not-allowed"
              }`}
              style={{ background: `${items?.color}` }}
              disabled={!isCurrentNoteEditing}
              value={items?.note} // Update this with the local updatedNotes value
              onChange={(e) => handleChange(e, items.id, 'note')} // Capture onChange to update the state
            ></textarea>
 {isCurrentNoteEditing ? <div>
              <select className="border-2 border-black" name="priority" id="priority"
              value={items?.priority}
              onChange={(e)=>handleChange(e, items.id, 'priority')}
          >
  <option value="LOW">LOW</option>
  <option value="MEDIUM">MEDIUM</option>
  <option value="HIGH">HIGH</option>

</select>
  </div>:
  <div>
<h2>Prioirty: {items?.priority}</h2>
  </div>}
            <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
              {expiration_date}
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              {items?.is_done === false ? (
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={(e) => onMarkDone(e, items?.id, items?.is_done)}
                >
                  Mark Done
                </button>
              ) : (
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={(e) => onMarkDone(e, items?.id, items?.is_done)}
                >
                  Mark UnDone
                </button>
              )}

              {!isCurrentNoteEditing ? (
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={() => onEdit(items.id)} // Edit this specific note
                >
                  Edit
                </button>
              ) : (
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={(e) => {
                    onUpdate(items.id, items.note , items?.priority); // Pass the note ID and content to update
                  }}
                >
                  Update
                </button>
              )}

              <button
                className="text-red-500 text-sm hover:underline"
                onClick={(e) => {
                  onDelete(e, items?.id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notes;
