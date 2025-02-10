"use server";
import { createClient } from "@/utils/supabase/server";

type Food = {
  title: string;
  page: string;
  image_urls: string[];
};

export async function addFood(formData: Food) {
  const supabase = await createClient();
  console.log(formData, "formss");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    console.error("User is not authenticated in addMessage server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from("photo_review").insert([
    {
      uploaded_by: user?.id,
      page: formData?.page,
      title: formData?.title,
      image_urls: formData?.image_urls,
    },
  ]);

  if (error) {
    console.error("Error inserting DATA", error);
    return { status: 500, message: "Error inserting DATA" };
  }

  return { status: 200, message: "Success" };
}
type Review = {
  posted_by?: string;
  food_id: string;
  rate: number;
  review: string;
};

export async function addReview(formData: Review) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User is not authenticated in addMessage server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from("food_reviews").insert([
    {
      posted_by: user?.id,
      food_id: formData?.food_id,
      rate: formData?.rate,
      review: formData?.review,
    },
  ]);

  if (error) {
    console.error("Error inserting DATA", error);
    return { status: 500, message: "Error inserting DATA" };
  }

  return { status: 200, message: "Success" };
}
