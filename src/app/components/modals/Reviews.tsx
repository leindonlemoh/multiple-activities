import React, { useState, useEffect } from "react";
import { inputChange } from "@/lib/onChange";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/lib/getUser";
import { addReview } from "@/lib/item-reviews";
import Swal from "sweetalert2";
import AddReview from "./AddReview";
import ReviewList from "./ReviewList";
import useSWR, { mutate } from "swr";
import { updateReview } from "@/lib/item-reviews";
import { deleteData } from "@/utils/deleteDatas";
const Reviews = ({
  onClose,
  selectedContent,
}: {
  onClose: () => void;
  selectedContent: any;
}) => {
  const itemId = selectedContent?.id;
  const from = selectedContent?.page;
  const [user, setUser] = useState<any>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    food_id: itemId,
    rate: 3,
    review: "",
  });
  const fetchReviews = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("item_reviews")
      .select("*")
      .eq("item_id", itemId)
      .order("created_at", { ascending: false });

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

  const onSubmitReview = async (e: any) => {
    e.preventDefault();
    console.log("From", formData);
    const response = await addReview(formData);
    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "New Review has been added",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("reviews");
        setFormData({
          food_id: itemId,
          rate: 3,
          review: "",
        });
      });
    }
  };
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

  return (
    <div className="w-[80vw] h-[80vh] p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Leave a Review
      </h2>

      <div className="w-full flex flex-col">
        <div className="sticky top-0 bg-slate-400  p-4 rounded-lg shadow-md z-10 mb-4">
          <AddReview
            onSubmit={onSubmitReview}
            setFormData={setFormData}
            formData={formData}
          />
        </div>
        <div className="space-y-4">
          {savedReviews?.map((items: any, index: number) => {
            console.log(items);
            const userEdit = user === items?.posted_by;
            return (
              <div className="space-y-4" key={index}>
                <ReviewList
                  // itemId={itemId}
                  from={from}
                  user={user}
                  index={index}
                  // userEdit={userEdit}
                  // setIsEditing={setIsEditing}
                  // isEditing={isEditing}
                  isLoading={isLoading}
                  savedReviews={items}
                  onDelete={onDelete}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
