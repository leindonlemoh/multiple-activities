import React from "react";

const SearchBar = ({
  handleSearchChange,
  from,
}: {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  from: string;
}) => {
  return (
    <div className="flex justify-center items-center mt-4 mb-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          name="input"
          onChange={handleSearchChange}
          className="w-full py-3 px-5 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500 text-black"
          placeholder={`Search ${from}`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
