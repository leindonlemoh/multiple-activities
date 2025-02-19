import React, {
  useState,
  ChangeEvent,
  useRef,
  useTransition,
  useEffect,
} from "react";
import { convertBlobUrlToFile } from "@/lib/convertBlobUrlToFile";
import { deleteImage, uploadImage } from "@/utils/supabase/storage/client";
import Swal from "sweetalert2";
import Image from "next/image";
import { updatePhotoGdrive } from "@/lib/g-drive";
import { mutate } from "swr";

import Loading from "../Loading";
const UpdateGDrive = ({
  onClose,
  selectedContent,
}: {
  onClose: () => void;
  selectedContent: any;
}) => {
  console.log(selectedContent?.image_url);
  const [imageUrl, setImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    setImageUrl(selectedContent?.image_url);
  }, [selectedContent]);

  const imageRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<string>("");
  const [originalFiles, setOriginalFiles] = useState<
    { name: string; url: string }[]
  >([]);

  // 1 After selecting files - request url to use sa preview
  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = e.target.files;

      // -request url preview
      const newImageUrls = URL.createObjectURL(filesArray[0]);

      //   - combine url and orig name
      const newOriginalFiles = [
        {
          name: filesArray[0].name,
          url: newImageUrls,
        },
      ];

      //   //   - use later for preview
      setImageUrls(newOriginalFiles[0]?.url);

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

    const { url, name } = originalFiles[0];
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

    return uploadedUrls;
  };

  // 3. submit - database gdrive
  const onUpdatePhoto = async () => {
    try {
      // - initiate waiting - button - disabled
      startTransition(async () => {
        // -1: request upload in numb 2 - returns aray of obj name and url
        const uploadedImageUrls = await onUploadImage();

        const response = await updatePhotoGdrive({
          id: selectedContent?.id,
          name: uploadedImageUrls[0]?.name,
          image_url: uploadedImageUrls[0]?.url,
        });

        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Photo has been Updated`,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            deleteImage(selectedContent?.image_url);
            setImageUrls("");
            setOriginalFiles([]);
            mutate("gdrive");
            onClose();
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

  const removeImage = () => {
    setImageUrls("");
    setOriginalFiles([]);
  };
  return (
    <div className="w-[760px] border-2 border-[black] ">
      <h3 className="text-black text-2xl">Preview / Update Photo</h3>
      {!isUpdating ? (
        <div>
          <div className="relative w-full h-64">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Food"
                fill
                className="rounded-md group-hover:opacity-80 transition-opacity duration-300"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <Loading />
            )}
          </div>
          <div>
            <button
              type="button"
              className="bg-[#03045e] p-2 rounded-lg text-white"
              onClick={() => setIsUpdating(true)}
            >
              Update Image
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col">
            <div>
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
              <div
                className={`flex flex-wrap gap-4 ${
                  imageUrls ? "h-auto" : "h-[300px] border-2 border-[black]"
                }`}
              >
                {imageUrls == "" ? (
                  <div
                    onClick={() => imageRef.current?.click()}
                    className="w-[100%] flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    <span>Insert a Photo</span>
                  </div>
                ) : (
                  <div className="w-full border-2 border-[red] flex justify-center">
                    {imageUrls && (
                      <div className="  overflow-hidden rounded-lg">
                        <button onClick={removeImage}>remove</button>
                        <Image
                          src={imageUrls}
                          width={500}
                          height={500}
                          alt="Uploaded Image"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <input
                  type="file"
                  ref={imageRef}
                  disabled={isPending}
                  hidden
                  onChange={imageChange}
                />
              </div>
              <div className="flex justify-end gap-4"></div>
            </div>
            <div className="flex justify-end flex-row gap-x-4 w-full">
              {imageUrls != "" ? (
                <button
                  onClick={onUpdatePhoto}
                  className="bg-slate-600 py-2 w-40 rounded-lg text-white"
                  disabled={isPending}
                >
                  {isPending ? "Uploading . . ." : "Upload Image"}
                </button>
              ) : (
                <></>
              )}
              <button
                type="button"
                className="bg-[#e63946] p-2 rounded-lg text-white"
                onClick={() => setIsUpdating(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateGDrive;
