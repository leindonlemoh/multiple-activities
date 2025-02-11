import React, { useState, useRef } from "react";
import PreviewReview from "../components/PreviewReview";
import SearchBar from "../components/SearchBar";
import { createClient } from "@/utils/supabase/client";
import Loading from "../components/Loading";
import useSWR, { mutate } from "swr";
import Swal from "sweetalert2";
import { deleteItem } from "@/lib/item-reviews";
const fetchPokemon = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("photo_review")
    .select("*")
    .eq("page", "pokemon_review");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

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
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [sortedPokemon, setSortedPokemon] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const {
    data: savedPokemons,
    error,
    isLoading,
  } = useSWR("pokemon_reviews", fetchPokemon, {
    refreshInterval: 60000,
  });

  if (error) return <div>Error loading food reviews: {error.message}</div>;
  if (isLoading) return <Loading />;

  const pokemonData = savedPokemons ?? [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
  };

  const handleSortByDate = () => {
    const sorted = [...pokemonData].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedPokemon(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
        const response = await deleteItem(id);
        if (response?.status == 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          }).then(() => {
            mutate("pokemon_reviews");
          });
        }
      }
    });
  };

  const filteredPokemon = pokemonData
    ?.filter((items: any) =>
      items.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="flex flex-col h-[92vh]">
      <div className="w-full flex justify-center py-3 border-b-2">
        <button
          onClick={AddItem}
          className="bg-[blue] px-8 py-2 font-mono font-extrabold text-lg rounded-xl"
        >
          Add Review
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <SearchBar handleSearchChange={handleSearchChange} from={"Pokemon"} />
        <div className="flex justify-end">
          <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
        <div className="flex flex-row gap-2 m-5">
          {filteredPokemon
            ?.filter((items: any) =>
              items.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((items: any, index: number) => (
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
