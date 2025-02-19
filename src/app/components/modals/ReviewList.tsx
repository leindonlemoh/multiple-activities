import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { mutate } from "swr";
import { updateReview } from "@/lib/item-reviews";
const ReviewList = ({
  from,
  user,
  isLoading,
  savedReviews,
  index,
  // setIsEditing,
  // isEditing,
  onDelete,
}: {
  from: string;
  user: any;

  isLoading: boolean;
  savedReviews: any;
  // setIsEditing: (res: boolean) => void;
  // isEditing: boolean;
  onDelete: (e: any, id: number) => void;
  index: number;
}) => {
  const userEdit = user?.id === savedReviews?.posted_by;
  console.log(userEdit);

  // Create a local state for review text when editing
  const [reviewText, setReviewText] = useState(savedReviews?.review || "");
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  // Update reviewText state when savedReviews changes
  useEffect(() => {
    setReviewText(savedReviews?.review || "");
  }, [savedReviews?.review]);

  // Handle the change in textarea and update local state
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  // Update the review on update button click
  const onUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const response = await updateReview(id, reviewText);
    if (response?.status === 200) {
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
          setCurrentEdit(null);
        });
    }
  };

  return (
    <div className="bg-white w-full rounded-lg border border-gray-300 shadow-md p-4 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3">
        {userEdit && (
          <div>
            {currentEdit == null ? (
              <div className=" w-full flex justify-end">
                <button
                  type="button"
                  className="border-2 p-3 rounded-lg hover:text-red-700 bg-[#03045e] text-white"
                  onClick={() => {
                    setCurrentEdit(index);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-white border-2 p-3 rounded-lg hover:text-red-700 bg-[red]"
                  onClick={(e) => onDelete(e, savedReviews?.id)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  className=" border-2 p-3 rounded-lg hover:text-red-700 bg-[#03045e] text-white"
                  onClick={(e) => onUpdate(e, savedReviews?.id)}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="text-white border-2 p-3 rounded-lg hover:text-red-700 bg-[red]"
                  onClick={() => {
                    setCurrentEdit(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center space-x-1 justify-between">
          <div className="flex flex-row">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < savedReviews?.rate ? "text-yellow-400" : "text-gray-300"
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
          <div>
            <p>
              Posted by:{" "}
              <b>
                {user?.id == savedReviews?.posted_by
                  ? "You"
                  : savedReviews?.name}
              </b>
            </p>
          </div>
        </div>

        {userEdit && currentEdit == index ? (
          <textarea
            value={reviewText} // Use the state as the value
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            rows={4}
            onChange={handleReviewChange} // Handle change and update state
          />
        ) : (
          <p className="text-gray-700">{savedReviews?.review}</p>
        )}

        <span className="text-sm text-gray-500">
          Date Posted: {new Date(savedReviews?.created_at).toLocaleString()}{" "}
          {savedReviews?.created_at !== savedReviews?.updated_at
            ? `Date Updated ${new Date(
                savedReviews?.updated_at
              ).toLocaleString()}`
            : ""}
        </span>
      </div>
    </div>
  );
};

export default ReviewList;
