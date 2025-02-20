import React, { useState, useRef, useEffect } from "react";
import PreviewReview from "../components/PreviewReview";
import SearchBar from "../components/SearchBar";
import { createClient } from "@/utils/supabase/client";
import Loading from "../components/Loading";
import useSWR, { mutate } from "swr";
import Swal from "sweetalert2";
import { fetchData } from "@/utils/fetchData";

import { deleteData } from "@/utils/deleteDatas";

const PokemonReview = ({
  AddItem,
  AddReview,
  PreviewUpdate,
}: {
  AddItem: () => void;
  AddReview: (type: string, selectedContent: any) => void;
  PreviewUpdate: (type: string, selectedContent: any) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sortedImages, setSortedImages] = useState<any[]>([]);
  const [selectedSort, setSelectedSort] = useState("A-Z");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
  };
  const fetchPokemon = async () => {
    const response = await fetchData("photo_review", {
      page: "pokemon_review",
    });
    return response;
  };
  const {
    data: savedPokemons,
    error,
    isLoading,
  } = useSWR("pokemon_reviews", fetchPokemon, {
    refreshInterval: 10000,
  });
  const savedData = savedPokemons ?? [];
  const onDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure you want to Delete this item?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteData("photo_review", id);
        if (response?.status == 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            mutate("pokemon_reviews");
          });
        }
      }
    });
  };

  useEffect(() => {
    if (savedData) {
      const filteredData = savedData.filter((items: any) =>
        items.title.toLowerCase().includes(search.toLowerCase())
      );
      let sorted = [...filteredData];
      if (selectedSort === "A-Z") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (selectedSort === "Z-A") {
        sorted.sort((a, b) => b.title.localeCompare(a.title));
      } else if (selectedSort === "N-O") {
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (selectedSort === "O-N") {
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      if (JSON.stringify(sorted) !== JSON.stringify(sortedImages)) {
        setSortedImages(sorted);
      }
    }
  }, [savedData, selectedSort, search]);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
  };
  if (error) return <div>Error loading food reviews: {error.message}</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-[92vh]">
      <SearchBar handleSearchChange={handleSearchChange} from={"Pokemon"} />
      <div className="w-full flex justify-center py-3 border-b-2">
        <button
          onClick={AddItem}
          className="bg-[blue] px-8 py-2 font-mono font-extrabold text-lg rounded-xl text-white"
        >
          Add Pokemon
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex justify-end gap-x-3 mr-2">
          <label className="text-lg font-semibold mr-2">Sort By:</label>
          <select
            name="sort"
            value={selectedSort}
            onChange={handleSelectChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="A-Z" className="text-center">
              A-Z
            </option>
            <option value="Z-A" className="text-center">
              Z-A
            </option>
            <option value="N-O" className="text-center">
              Date: Newest - Oldest
            </option>
            <option value="O-N" className="text-center">
              Date: Oldest - Newest
            </option>
          </select>
        </div>
        <div className="flex flex-row gap-2 m-5">
          {sortedImages.map((items: any, index: number) => (
            <PreviewReview
              item={items}
              key={index}
              AddReview={AddReview}
              onDelete={onDelete}
              PreviewUpdate={PreviewUpdate}
              from={"pokemon"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonReview;
