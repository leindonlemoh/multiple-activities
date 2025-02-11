import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getUser } from "@/lib/getUser";

const PreviewReview = ({
  item,
  AddReview,
  onDelete,
  PreviewUpdate,
  from,
}: {
  item: any;
  AddReview: (type: string, selectedContent: any) => void;
  onDelete: (id: number) => void;
  PreviewUpdate: (type: string, selectedContent: any) => void;
  from: string;
}) => {
  const [user, setUser] = useState<string | undefined>("");

  const openReviews = (type: string, selectedContent: string) => {
    AddReview(type, selectedContent);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData?.id);
      }
    };

    fetchUser();
  }, []);
  const onEdit = (type: string, selectedContent: string) => {
    console.log(selectedContent);
    PreviewUpdate(type, selectedContent);
  };
  return (
    <section className="w-[350px] bg-white rounded-lg shadow-lg overflow-hidden my-1 relative">
      {user == item?.uploaded_by && (
        <button
          className="absolute w-[40px] h-[40px] top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 text-3xl"
          type="button"
          onClick={() => {
            onDelete(item?.id);
          }}
        >
          &times;
        </button>
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{item?.title}</h2>
        <span className="text-black">
          {" "}
          Posted: {new Date(item?.created_at).toLocaleString()}{" "}
        </span>
      </div>

      <div className="h-64 cursor-pointer relative group">
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex h-full relative group">
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
        {from == "food" ? (
          <div
            className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex justify-center items-center"
            onClick={() => onEdit("PreviewUpdateItemFood", item)}
          >
            <p className="text-center text-3xl">Preview</p>
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex justify-center items-center"
            onClick={() => onEdit("PreviewUpdateItemPokemon", item)}
          >
            <p className="text-center text-3xl">Preview</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => openReviews("AddReview", item)}
        >
          Read Reviews
        </button>
      </div>
    </section>
  );
};

export default PreviewReview;
