import React from "react";

const AddNotesForm = ({
  noteList,
  onChangeSaved,
  condition,
  buttonColors,
  selectedButton,
  onNoteSubmit,
  setSelectedBUtton,
  setNoteList,
}: {
  noteList: any;
  onChangeSaved: (e: any) => void;
  condition: any;
  buttonColors: string[];
  selectedButton: string;
  onNoteSubmit: (e: any) => void;
  setSelectedBUtton: (arg: string) => void;
  setNoteList: (arg: any) => void;
}) => {
  return (
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
                  setNoteList((prevNoteList: any) => ({
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
  );
};

export default AddNotesForm;
