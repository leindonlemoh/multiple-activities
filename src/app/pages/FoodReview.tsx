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
  const [selectedSort, setSelectedSort] = useState("A-Z");
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

      if (selectedSort === "A-Z") {
        // Sorting by name (A-Z)
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (selectedSort === "Z-A") {
        // Sorting by name (Z-A)
        sorted.sort((a, b) => b.title.localeCompare(a.title));
      } else if (selectedSort === "N-O") {
        // Sorting by date (Newest - Oldest)
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (selectedSort === "O-N") {
        // Sorting by date (Oldest - Newest)
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      setSortedFoods(sorted);
    }
  }, [savedFoods, selectedSort]);

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
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
