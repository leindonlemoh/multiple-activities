import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { updateReview } from "@/lib/item-reviews";
import Swal from "sweetalert2";
import { mutate } from "swr";
import { deleteData } from "@/utils/deleteDatas";
import Loading from "../Loading";
const ReviewList = ({
  itemId,
  from,
  user,
}: {
  itemId: any;
  from: string;
  user: string | undefined;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ascending, setAscending] = useState(false);

  const fetchReviews = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("item_reviews")
      .select("*")
      .eq("item_id", itemId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const {
    data: savedReviews,
    error,
    isLoading,
  } = useSWR("reviews", fetchReviews, {
    refreshInterval: 10000,
  });
  if (isLoading) return <Loading />;

  const onDelete = async (e: any, id: number) => {
    Swal.fire({
      title: "Are you sure you want to Delete this review?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteData("item_reviews", id);
        if (response?.status == 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your Review has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            mutate("reviews");
          });
        }
      }
    });
  };

  const onUpdate = async (e: any) => {
    e.preventDefault();
    const response = await updateReview(savedReviews);
    if (response?.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Review has been updated",
        showConfirmButton: false,
        timer: 1500,
      })
        .then(() => {
          mutate("reviews");
        })
        .then(() => {
          setIsEditing(!isEditing);
        });
    }
  };

  const sortedReviews = savedReviews?.sort((a, b) => {
    const dateA = new Date(a?.created_at) as any;
    const dateB = new Date(b?.created_at) as any;

    return ascending ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setAscending(!ascending);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={toggleSortOrder}
        className="  mb-4 p-2 bg-blue-500 text-white rounded-md shadow-md z-10"
      >
        Sort by Date & Time: {ascending ? "Ascending" : "Descending"}
      </button>

      {sortedReviews?.map((items: any, index: number) => {
        const userEdit = user === items?.posted_by;

        return (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <span className="font-semibold text-black">
                {items?.posted_by}
              </span>

              {userEdit && (
                <div>
                  {!isEditing ? (
                    <div className="flex gap-x-2">
                      <button
                        className="text-blue-500 hover:text-red-700"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => onDelete(e, items?.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-x-2">
                      <button
                        className="text-blue-500 hover:text-red-700"
                        onClick={(e) => onUpdate(e)}
                      >
                        Update
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < items?.rate ? "text-yellow-400" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2l2.09 6.26h6.61l-5.33 3.87 2.03 6.11-5.32-3.88-5.33 3.88 2.03-6.11-5.32-3.87h6.61L12 2z"
                  />
                </svg>
              ))}
            </div>

            {userEdit ? (
              <textarea
                defaultValue={items?.review}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                rows={4}
                disabled={!isEditing}
              />
            ) : (
              <p className="text-gray-700">{items?.review}</p>
            )}

            <span className="text-sm text-gray-500">
              Date Post: {new Date(items?.created_at).toLocaleString()}{" "}
              {items?.created_at != items?.updated_at
                ? `Date Updated ${new Date(items?.updated_at).toLocaleString()}`
                : ``}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
