import React from "react";
import Image from "next/image";
const GDriveUploads = ({
  items,
  onDelete,
  UpdatePhoto,
}: {
  items: any;
  onDelete: (e: any, id: number, url: string) => void;
  UpdatePhoto: (type: string, selectedContent: any) => void;
}) => {
  const onPreview = (type: string, selectedContent: any) => {
    UpdatePhoto(type, selectedContent);
  };
  return (
    <div>
      <div className="h-64 cursor-pointer relative group p-2">
        <div className="w-full h-full relative rounded-md  border-2 border-[black]">
          <Image
            src={items?.image_url}
            alt="Food"
            fill
            className="rounded-md group-hover:opacity-80 transition-opacity duration-300"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex justify-center items-center"
          onClick={() => onPreview("PreviewUpdateGDrive", items)}
        >
          <p className="text-center text-3xl text-white">Preview</p>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {items?.name || ""}
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          {new Date(items?.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={(e) => onDelete(e, items?.id, items?.image_url)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDriveUploads;
