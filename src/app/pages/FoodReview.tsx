import React, { useState } from "react";
import PreviewReview from "../components/PreviewReview";
import SearchBar from "../components/SearchBar";
import { createClient } from "@/utils/supabase/client";
import Loading from "../components/Loading";
import useSWR from "swr";

const fetchFoods = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("photo_review")
    .select("*")
    .eq("page", "food_review")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const FoodReview = ({
  AddFood,
  AddReview,
}: {
  AddFood: () => void;
  AddReview: (type: string, selectedContent: any) => void;
}) => {
  const [search, setSearch] = useState("");

  const {
    data: savedFoods,
    error,
    isLoading,
  } = useSWR("food_reviews", fetchFoods, {
    refreshInterval: 60000,
  });

  if (error) return <div>Error loading food reviews: {error.message}</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-[92vh]">
      <div className="w-full flex justify-center py-3 border-b-2">
        <button
          onClick={AddFood}
          className="bg-[blue] px-8 py-2 font-mono font-extrabold text-lg rounded-xl"
        >
          Add Review
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <SearchBar toSearch={setSearch} />
        <div className="flex flex-row gap-2 m-5">
          {savedFoods
            ?.filter((items: any) =>
              items.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((items: any, index: number) => (
              <PreviewReview item={items} key={index} AddReview={AddReview} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoodReview;
