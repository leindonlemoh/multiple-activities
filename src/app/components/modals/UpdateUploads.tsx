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
import { addReviewItem, updateItem } from "@/lib/item-reviews";
import { mutate } from "swr";
import Swal from "sweetalert2";

const UpdateUploads = ({
  onClose,
  selectedContent,
  from,
}: {
  onClose: () => void;
  selectedContent: any;
  from: string;
}) => {
  const toMutate = from == "food" ? "food_review" : "pokemon_review";
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [foodData, setFoodData] = useState({
    title: selectedContent?.title,
    page: selectedContent?.page,
    image_urls: selectedContent?.image_urls || [],
  });

  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newImageUrls]);
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

  const onUpdateItem = async () => {
    try {
      startTransition(async () => {
        const uploadedImageUrls =
          imageUrls.length > 0 ? await onUploadImage() : [];

        const updatedImageUrls = [
          ...foodData.image_urls.filter(
            (url: string) => !url.startsWith("blob:")
          ),
          ...uploadedImageUrls.filter(
            (url) => !foodData.image_urls.includes(url)
          ),
        ];

        const response = await updateItem({
          id: selectedContent?.id,
          title: foodData.title,
          page: foodData.page,
          image_urls: updatedImageUrls,
        });

        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Item updated successfully`,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            onClose();
            mutate(toMutate);
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
      console.error("Error updating item:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update item",
        showConfirmButton: true,
      });
    }
  };

  const handleDeleteImage = (url: string) => {
    const updatedImages = foodData.image_urls.filter(
      (image: string) => image !== url
    );
    setFoodData((prevData) => ({
      ...prevData,
      image_urls: updatedImages,
    }));
  };

  useEffect(() => {
    if (imageUrls.length > 0) {
      setFoodData((prevData) => ({
        ...prevData,
        image_urls: [
          ...prevData.image_urls.filter(
            (url: string) => !url.startsWith("blob:")
          ),
          ...imageUrls.filter((url) => !prevData.image_urls.includes(url)),
        ],
      }));
    }
  }, [imageUrls]);

  return (
    <div className="w-[760px] p-6 border border-gray-300 rounded-lg bg-white text-black">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {selectedContent?.page === "food_review"
            ? "Food Name"
            : "Pokemon Name"}
        </label>
        <input
          name="title"
          type="text"
          required
          value={foodData?.title}
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
        {/* Display all images */}
        {foodData?.image_urls.map((url: string, index: number) => (
          <div
            key={index}
            className="w-36 h-36 overflow-hidden rounded-lg relative"
          >
            <button
              onClick={() => handleDeleteImage(url)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              X
            </button>
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
          onClick={onUpdateItem}
          className="bg-slate-600 py-2 w-40 rounded-lg text-white"
          disabled={isPending}
        >
          {isPending ? "Updating . . ." : "Update Item"}
        </button>
      </div>
    </div>
  );
};

export default UpdateUploads;
