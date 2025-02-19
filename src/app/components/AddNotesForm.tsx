import React from "react";

const AddNotesForm = ({
  isLoading,
  noteList,
  onChangeSaved,
  buttonColors,
  selectedButton,
  onNoteSubmit,
  setSelectedBUtton,
}: {
  isLoading: boolean;
  noteList: any;
  onChangeSaved: (e: any) => void;
  buttonColors: string[];
  selectedButton: string;
  onNoteSubmit: (e: any) => void;
  setSelectedBUtton: (arg: string) => void;
}) => {
  return (
    <form className="w-full h-full flex flex-col p-4 text-center">
      <div className="flex-1 mb-4">
        <div className="border-2 rounded-lg mb-4">
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
            value={
              noteList?.date
                ? new Date(noteList?.date).toISOString().split("T")[0]
                : ""
            }
            className="w-[50%] border-2 border-gray-300 p-2 rounded-lg"
            onChange={onChangeSaved}
            required
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex w-full justify-center gap-5">
          {buttonColors?.map((color: string, index: number) => (
            <div key={index}>
              <button
                type="button"
                className={`w-12 h-12 rounded-full border-2 ${
                  selectedButton === color ? "border-[white]" : "border-black"
                }`}
                onClick={() => {
                  setSelectedBUtton(color);
                  onChangeSaved({ target: { name: "color", value: color } }); // Update color in noteList
                }}
                style={{ background: color }}
              ></button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-24 h-10 bg-blue-500 text-white rounded-md"
          onClick={onNoteSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AddNotesForm;
