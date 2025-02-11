import React, { useState, useEffect } from "react";
import { inputChange } from "@/lib/onChange";
import { getUser } from "@/lib/getUser";
import { addReview } from "@/lib/item-reviews";
import Swal from "sweetalert2";
import AddReview from "./AddReview";
import ReviewList from "./ReviewList";
import { mutate } from "swr";
const Reviews = ({
  onClose,
  selectedContent,
}: {
  onClose: () => void;
  selectedContent: any;
}) => {
  console.log(selectedContent);
  const itemId = selectedContent?.id;
  const from = selectedContent?.page;
  const [user, setUser] = useState<string | undefined>("");
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData?.id);
    };
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    food_id: itemId,
    rate: 3,
    review: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await addReview(formData);
    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "New Note has been added",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("reviews");
      });
    }
  };

  return (
    <div className="w-[80vw] h-[80vh] p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Leave a Review
      </h2>

      <div className="w-full flex flex-col">
        <div className="sticky top-0 bg-slate-400  p-4 rounded-lg shadow-md z-10 mb-4">
          <AddReview
            onSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
          />
        </div>

        <ReviewList itemId={itemId} from={from} user={user} />
      </div>
    </div>
  );
};

export default Reviews;
