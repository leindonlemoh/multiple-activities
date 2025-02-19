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
  const [sortOrderDate, setSortOrderDate] = useState<"asc" | "desc">("asc");
  const [sortOrderName, setSortOrderName] = useState<"asc" | "desc">("asc");
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

  const handleSortByDate = () => {
    setSortOrderDate(sortOrderDate === "asc" ? "desc" : "asc");
  };

  const handleSortByName = () => {
    setSortOrderName(sortOrderName === "asc" ? "desc" : "asc");
  };
  useEffect(() => {
    if (savedData) {
      // Apply search filter first
      const filteredData = savedData.filter((items: any) =>
        items.title.toLowerCase().includes(search.toLowerCase())
      );

      // Sort data by date and name in one pass
      const sorted = [...filteredData].sort((a, b) => {
        // First, sort by name (if needed)
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (nameA < nameB) return sortOrderName === "asc" ? -1 : 1;
        if (nameA > nameB) return sortOrderName === "asc" ? 1 : -1;

        // If names are equal, sort by date
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrderDate === "asc" ? dateA - dateB : dateB - dateA;
      });

      // Only set the sorted images if the data has changed
      setSortedImages((prevSortedImages) => {
        // Check if the sorted data is different from the previous state
        if (JSON.stringify(prevSortedImages) !== JSON.stringify(sorted)) {
          return sorted;
        }
        return prevSortedImages; // Avoid unnecessary state update
      });
    }
  }, [savedData, sortOrderDate, sortOrderName, search]);

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
          <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Sort by Date ({sortOrderDate === "asc" ? "Ascending" : "Descending"}
            )
          </button>
          <button
            onClick={handleSortByName}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 ml-2"
          >
            Sort by Name ({sortOrderName === "asc" ? "Ascending" : "Descending"}
            )
          </button>
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
