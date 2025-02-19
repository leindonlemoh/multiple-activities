import React, {
  useState,
  ChangeEvent,
  useRef,
  useTransition,
  useEffect,
} from "react";
import { convertBlobUrlToFile } from "@/lib/convertBlobUrlToFile";
import { uploadImage } from "@/utils/supabase/storage/client";
import Swal from "sweetalert2";
import Image from "next/image";
import { addPhotoGDrive } from "@/lib/g-drive";
import { mutate } from "swr";
const UploadPhoto = ({ onClose }: { onClose: () => void }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalFiles, setOriginalFiles] = useState<
    { name: string; url: string }[]
  >([]);

  // 1 After selecting files - request url to use sa preview
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      console.log(filesArray);
      // -request url preview
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      console.log(newImageUrls);
      //   - combine url and orig name
      const newOriginalFiles = filesArray.map((file, index) => ({
        name: file.name,
        url: newImageUrls[index],
      }));

      //   - use later for preview
      setImageUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
      //   -use later for blobing
      setOriginalFiles((prevFiles) => [...prevFiles, ...newOriginalFiles]);
    }
  };

  useEffect(() => {
    console.log("Image URLs:", imageUrls);
    console.log("Original Files:", originalFiles);
  }, [imageUrls, originalFiles]);

  // 2. Uploading images - blob first - upload and it returns imageurl from supabase and its orig name
  const onUploadImage = async (): Promise<{ url: string; name: string }[]> => {
    const uploadedUrls: { url: string; name: string }[] = [];
    // -for each object blob the local url
    for (const file of originalFiles) {
      const { url, name } = file;
      const imageFile = await convertBlobUrlToFile(url);
      // - return blob url
      // Upload image only in bucket - strats with supabase_url
      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "food-review",
      });

      if (error) {
        console.error(error);
        throw new Error("Image upload failed");
      }

      // - save in variable each img url and orig name to use in submit database
      uploadedUrls.push({ url: imageUrl, name });
    }
    return uploadedUrls;
  };

  // 3. submit - database gdrive
  const onSubmitNewFood = async () => {
    try {
      // - initiate waiting - button - disabled
      startTransition(async () => {
        // -1: request upload in numb 2 - returns aray of obj name and url
        const uploadedImageUrls = await onUploadImage();
        console.log("Uploaded image URLs with filenames:", uploadedImageUrls);

        // -2: for each uploads it will submit in gdrive table
        const uploadPromises = uploadedImageUrls.map(({ url, name }) => {
          return addPhotoGDrive({
            name: name,
            image_url: url,
          });
        });

        // wait all response
        const responses = await Promise.all(uploadPromises);

        // check all response if 200 returns true or false
        const allUploaded = responses.every(
          (response) => response.status === 200
        );
        console.log(allUploaded, "allUploaded");
        if (allUploaded) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "All images uploaded successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setImageUrls([]);
            setOriginalFiles([]);
            mutate("gdrive");
            onClose();
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Failed to upload some images",
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

  const removeImage = (index: number) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setOriginalFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[760px] h-[100%] flex flex-col">
      <div className="h-[20%] border-2 border-[black] p-2">
        <label
          htmlFor="name"
          className="block text-1xl font-medium text-gray-700"
        >
          Upload Photo
        </label>
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

      {/* Display */}
      <div
        className={`flex flex-wrap gap-4 ${
          imageUrls.length != 0 ? "h-auto" : "h-[300px] border-2 border-[black]"
        }`}
      >
        {imageUrls.map((url, index) => (
          <div key={index} className="w-36 h-36 overflow-hidden rounded-lg">
            <button onClick={() => removeImage(index)}>remove</button>
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
          className="bg-slate-600 py-2 w-40 rounded-lg"
          disabled={isPending}
        >
          {isPending ? "Uploading . . ." : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

export default UploadPhoto;
