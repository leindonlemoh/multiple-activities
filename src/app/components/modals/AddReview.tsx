import React from "react";
import { inputChange } from "@/lib/onChange";

const AddReview = ({
  onSubmit,
  isPending,
  setFormData,
  formData,
}: {
  onSubmit: (e: any) => void;
  isPending: boolean;
  setFormData: (res: any) => void;
  formData: any;
}) => {
  const increment = () => {
    if (formData.rate < 5)
      setFormData({ ...formData, rate: formData.rate + 1 });
  };
  const decrement = () => {
    if (formData.rate > 1)
      setFormData({ ...formData, rate: formData.rate - 1 });
  };

  return (
    <div className="w-[100%] rounded-lg">
      {" "}
      <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium text-white" htmlFor="rating">
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
            className="block text-lg font-medium text-white"
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
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isPending}
          >
            {isPending ? "Processing" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
