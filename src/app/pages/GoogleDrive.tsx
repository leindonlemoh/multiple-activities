import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";
import { fetchData } from "@/utils/fetchData";
import { deleteData } from "@/utils/deleteDatas";
import GDriveUploads from "../components/GDriveUploads";
import Swal from "sweetalert2";
import { deleteImage } from "@/utils/supabase/storage/client";
import { inputChange } from "@/lib/onChange";

const GoogleDrive = ({
  UploadPhoto,
  UpdatePhoto,
}: {
  UploadPhoto: () => void;
  UpdatePhoto: (type: string, selectedContent: any) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sortedImages, setSortedImages] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedSort, setSelectedSort] = useState("A-Z");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
  };

  const fetchDatas = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const response = await fetchData("gdrive", { uploaded_by: user?.id });
    return response;
  };

  const { data: savedImages, error, isLoading } = useSWR("gdrive", fetchDatas);
  const savedData = savedImages ?? [];

  const onDelete = async (e: any, id: number, url: string) => {
    Swal.fire({
      title: "Are you sure you want to Delete File?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // delete img - db
        const response = await deleteData("gdrive", id);
        // delete img - bucket
        deleteImage(url);
        if (response?.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your Review has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            mutate("gdrive");
          });
        }
      }
    });
  };

  useEffect(() => {
    if (savedData) {
      // Apply search filter first
      const filteredData = savedData.filter((items: any) =>
        items.name.toLowerCase().includes(search.toLowerCase())
      );

      // Sort data by date and name in one pass
      let sorted = [...filteredData];

      if (selectedSort === "A-Z") {
        // Sorting by name (A-Z)
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (selectedSort === "Z-A") {
        // Sorting by name (Z-A)
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      } else if (selectedSort === "N-O") {
        // Sorting by date (Newest - Oldest)
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (selectedSort === "O-N") {
        // Sorting by date (Oldest - Newest)
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      // Update state only if sorting resulted in a change
      if (JSON.stringify(sorted) !== JSON.stringify(sortedImages)) {
        setSortedImages(sorted);
      }
    }
  }, [savedData, selectedSort, search]);

  useEffect(() => {
    console.log("selectedSort", selectedSort);
  }, [selectedSort]);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
  };
  return (
    <div className="">
      <SearchBar handleSearchChange={handleSearchChange} from={"Photo Name"} />
      <div className="  p-1 flex justify-center">
        <button
          type="button"
          className=" bg-[#03045e] flex items-center justify-center text-center
          p-1 rounded-3xl text-white px-2"
          onClick={UploadPhoto}
        >
          <span className="text-6xl">+</span>
          <p className="text-2xl">Upload Photo</p>
        </button>
      </div>
      <div>
        <div className="flex justify-end">
          <label className="text-lg font-semibold mr-2">Sort By:</label>
          <select
            name="sort"
            value={selectedSort}
            onChange={handleSelectChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="A-Z" className="text-center">
              A-Z
            </option>
            <option value="Z-A" className="text-center">
              Z-A
            </option>
            <option value="N-O" className="text-center">
              Date: Newest - Oldest
            </option>
            <option value="O-N" className="text-center">
              Date: Oldest - Newest
            </option>
          </select>

          {/* <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Sort by Date ({sortOrderDate === "asc" ? "Ascending" : "Descending"}
            )
          </button> */}
          {/* /* Button for sorting by name */}
          {/* <button
            onClick={handleSortByName}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 ml-2"
          >
            Sort by Name ({sortOrderName === "asc" ? "A-Z" : "Z-A"})
          </button> */}
        </div>
      </div>
      {
        <section className="h-auto flex flex-row flex-wrap gap-5 justify-center p-3">
          {sortedImages?.map((items: any, index: number) => (
            <div
              className="w-[20%] rounded overflow-hidden shadow-lg bg-white "
              key={index}
            >
              <GDriveUploads
                items={items}
                onDelete={onDelete}
                UpdatePhoto={UpdatePhoto}
              />
            </div>
          ))}
        </section>
      }
    </div>
  );
};

export default GoogleDrive;
