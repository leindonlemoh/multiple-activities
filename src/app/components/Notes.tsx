import React from 'react'

const Notes = ({
  notes,
  index
  }:{
    notes: any;
    index:number
    }) => {

  console.log(notes)
  return (
      <div className={`relative p-7 rounded-lg shadow-lg w-60 h-60 flex flex-col justify-between`}
    style={{ backgroundColor: notes?.color }}
    >
    <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-300 rotate-45 transform -translate-x-2 -translate-y-2"></div>
    <h3 className="font-semibold text-xl text-gray-800 mb-2">Note</h3>
    <p className="text-base text-gray-700 flex-grow">{notes?.note}</p>

    <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
      {notes?.date}
    </div>
    <div className="absolute top-4 right-4 flex gap-2">
      <button className="text-blue-500 text-sm hover:underline">Mark Done</button>
      <button className="text-blue-500 text-sm hover:underline">Edit</button>
      <button className="text-red-500 text-sm hover:underline">Remove</button>
    </div>
  </div>

    )
  }

export default Notes

// colors #e9ff70 #ffd670 #ff9770 #ff70a6 #70d6ff