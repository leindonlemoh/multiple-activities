"use server";
import { createClient } from "@/utils/supabase/server";

type Item = {
  title: string;
  page: string;
  image_urls: string[];
};

export async function addReviewItem(formData: Item) {
  const supabase = await createClient();
  console.log(formData, "formss");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    console.error("User is not authenticated in add Item server action");
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
export async function deleteItem(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User is not authenticated in delete Message server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase
    .from("photo_review")
    .delete()
    .match({ id: id, uploaded_by: user.id });

  if (error) {
    console.error("Error deleting message", error);
    return { status: 500, message: "Error inserting message" };
  }
  // revalidatePath('/home')

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
    console.error("User is not authenticated in add Review server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from("item_reviews").insert([
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
