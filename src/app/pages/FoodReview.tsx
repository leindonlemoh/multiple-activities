import React, { useState, useEffect } from "react";
import PreviewReview from "../components/PreviewReview";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import useSWR, { mutate } from "swr";
import Swal from "sweetalert2";
import { fetchData } from "@/utils/fetchData";
import { deleteData } from "@/utils/deleteDatas";

const fetchFoods = async () => {
  const response = await fetchData("photo_review", { page: "food_review" });
  return response;
};

const FoodReview = ({
  AddItem,
  AddReview,
  PreviewUpdate,
}: {
  AddItem: () => void;
  AddReview: (type: string, selectedContent: any) => void;
  PreviewUpdate: (type: string, selectedContent: any) => void;
}) => {
  const [sortedFoods, setSortedFoods] = useState<any[]>([]);
  const [sortByDate, setSortByDate] = useState<"asc" | "desc">("asc");
  const [sortByName, setSortByName] = useState<"asc" | "desc">("asc");

  const {
    data: savedFoods,
    error,
    isLoading,
  } = useSWR("food_reviews", fetchFoods, {
    refreshInterval: 10000,
  });

  useEffect(() => {
    // If the data changes, apply the sorting logic
    if (savedFoods) {
      let sorted = [...savedFoods];

      // Apply date sorting
      sorted.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortByDate === "asc" ? dateA - dateB : dateB - dateA;
      });

      // Apply name sorting
      sorted.sort((a, b) => {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (nameA < nameB) return sortByName === "asc" ? -1 : 1;
        if (nameA > nameB) return sortByName === "desc" ? 1 : -1;
        return 0;
      });

      setSortedFoods(sorted);
    }
  }, [savedFoods, sortByDate, sortByName]);

  if (error) return <div>Error loading food reviews: {error.message}</div>;
  if (isLoading) return <Loading />;

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
            mutate("food_reviews");
          });
        }
      }
    });
  };

  const handleSortByDate = () => {
    setSortByDate(sortByDate === "asc" ? "desc" : "asc");
  };

  const handleSortByName = () => {
    setSortByName(sortByName === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col h-[92vh]">
      <div className="w-full flex justify-center py-3 border-b-2">
        <button
          onClick={AddItem}
          className="bg-[blue] px-8 py-2 font-mono font-extrabold text-lg rounded-xl text-white"
        >
          Add Food
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex justify-end gap-x-2 mr-1">
          <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Sort by Date ({sortByDate === "asc" ? "Ascending" : "Descending"})
          </button>
          <button
            onClick={handleSortByName}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 ml-2"
          >
            Sort by Name ({sortByName === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
        <div className="flex flex-row gap-2 m-5">
          {sortedFoods?.map((items: any, index: number) => (
            <PreviewReview
              item={items}
              key={index}
              AddReview={AddReview}
              onDelete={onDelete}
              PreviewUpdate={PreviewUpdate}
              from={"food"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodReview;
