import Image from "next/image";
import React, {
  useState,
  ChangeEvent,
  useRef,
  useTransition,
  useEffect,
} from "react";
import { convertBlobUrlToFile } from "@/lib/convertBlobUrlToFile";
import { uploadImage } from "@/utils/supabase/storage/client";
import { inputChange } from "@/lib/onChange";
import { addReviewItem } from "@/lib/item-reviews";
import { mutate } from "swr";
import Swal from "sweetalert2";

const AddItem = ({ onClose, from }: { onClose: () => void; from: string }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [foodData, setFoodData] = useState({
    title: "",
    page: from == "food" ? "food_review" : "pokemon_review",
    image_urls: [] as string[],
  });
  console.log(from, "from");
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };
  const onUploadImage = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const url of imageUrls) {
      const imageFile = await convertBlobUrlToFile(url);

      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "food-review",
      });

      if (error) {
        console.error(error);
        throw new Error("Image upload failed");
      }

      urls.push(imageUrl);
    }
    return urls;
  };
  const onSubmitNewFood = async () => {
    try {
      startTransition(async () => {
        const uploadedImageUrls = await onUploadImage();

        const response = await addReviewItem({
          title: foodData.title,
          page: foodData.page,
          image_urls: uploadedImageUrls,
        });

        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `New ${from} has been added`,
            showConfirmButton: false,
            timer: 1500,
          })
            .then(() => {
              onClose();
            })
            .then(() => {
              if (from == "food") {
                mutate("food_reviews");
              } else {
                mutate("pokemon_reviews");
              }
            });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Something went wrong",
            showConfirmButton: true,
          });
        }
      });
    } catch (error) {
      console.error("Error uploading images or submitting food data:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to upload images or submit food",
        showConfirmButton: true,
      });
    }
  };
  useEffect(() => {
    console.log(imageUrls);
    console.log(foodData);
  }, [imageUrls, foodData]);
  return (
    <div className="w-[760px]  p-6 border border-gray-300 rounded-lg bg-white text-black">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {from == "food" ? "Food Name" : "Pokemon Name"}
        </label>
        <input
          name="title"
          type="text"
          required
          onChange={(e) => inputChange(e, setFoodData)}
          placeholder="Enter Food Name"
          className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-4">
        <input
          type="file"
          multiple
          ref={imageRef}
          disabled={isPending}
          hidden
          onChange={imageChange}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="w-36 h-36 overflow-hidden rounded-lg">
            <Image
              src={url}
              width={300}
              height={300}
              alt="Uploaded Image"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => imageRef.current?.click()}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Images
        </button>
        <button
          onClick={onSubmitNewFood}
          className="bg-slate-600 py-2 w-40 rounded-lg text-white"
          disabled={isPending}
        >
          {isPending ? "Uploading . . ." : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

export default AddItem;
