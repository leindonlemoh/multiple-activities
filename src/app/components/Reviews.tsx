import React, { useState, useEffect } from "react";
import { inputChange } from "@/lib/onChange";
import { getUser } from "@/lib/getUser";
import { addReview } from "@/lib/item-reviews";
import Swal from "sweetalert2";
const Reviews = ({
  onClose,
  selectedContent,
}: {
  onClose: () => void;
  selectedContent: any;
}) => {
  const [formData, setFormData] = useState({
    food_id: selectedContent?.id,
    rate: 3,
    review: "",
  });
  const increment = () => {
    if (formData.rate < 5)
      setFormData({ ...formData, rate: formData.rate + 1 });
  };
  const decrement = () => {
    if (formData.rate > 1)
      setFormData({ ...formData, rate: formData.rate - 1 });
  };

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
      }).then(() => {});
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Leave a Review
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium text-gray-700" htmlFor="rating">
            Rating (1-5)
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={decrement}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              -
            </button>
            <input
              id="rating"
              name="rate"
              type="number"
              value={formData.rate}
              min="1"
              max="5"
              readOnly
              className="w-16 text-center border border-gray-300 rounded-md py-2 focus:outline-none text-black"
            />
            <button
              type="button"
              onClick={increment}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="review"
          >
            Your Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={(e) => inputChange(e, setFormData)}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Write your review here..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reviews;
