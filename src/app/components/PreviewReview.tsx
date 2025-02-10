import React from "react";
import Image from "next/image";

const PreviewReview = ({
  item,
  AddReview,
}: {
  item: any;
  AddReview: (type: string, selectedContent: any) => void;
}) => {
  const openReviews = (type: string, selectedContent: string) => {
    AddReview(type, selectedContent);
  };
  return (
    <div className="w-[350px] bg-white rounded-lg shadow-lg overflow-hidden my-1">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{item?.title}</h2>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500 text-sm">{"Reviews"}</span>
          <span className="text-gray-600 text-sm ml-2">
            {"number of reviews"}
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div className="h-64">
        {item?.image_urls.length === 1 ? (
          <div className="w-full h-full relative">
            <Image
              src={item?.image_urls[0]}
              alt="Food"
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex h-full">
            {/* First Image (Left Side) */}
            <div className="w-1/2 relative h-full">
              {item?.image_urls.length > 0 && (
                <Image
                  src={item?.image_urls[0]}
                  alt="Food"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-l-lg"
                />
              )}
            </div>

            {/* Other Images (Right Side) */}
            <div className="w-1/2 p-4 grid grid-cols-2 gap-4 h-full">
              {item?.image_urls.slice(1).map((url: string, index: number) => (
                <div key={index} className="relative w-full h-32">
                  <Image
                    src={url}
                    alt={`Food ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer with Button */}
      <div className="p-4">
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => openReviews("AddReview", item)}
        >
          Read Reviews
        </button>
      </div>
    </div>
  );
};

export default PreviewReview;
