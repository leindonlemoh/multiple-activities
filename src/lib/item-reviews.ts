"use server";
import { createClient } from "@/utils/supabase/server";

type Item = {
  title: string;
  page: string;
  image_urls: string[];
};
// add new ITEM to Review
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
// update Item
export async function updateItem(formData: any) {
  const supabase = await createClient();
  console.log(formData);
  const id = formData?.id;

  const request = {
    title: formData?.title,
    page: formData?.page,
    image_urls: formData?.image_urls,
  };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "User is not authenticated in updating Message server action"
    );
    return { message: "User not authenticated" };
  }
  const { data, error } = await supabase
    .from("photo_review")
    .update({
      ...request,
    })
    .match({ id: id, uploaded_by: user.id });

  if (error) {
    console.log(request + "content");
    console.log(id, "id");
    console.error("Error updating item", error);
    return { status: 500, message: "Error updating Item" };
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
// add review on the Item
export async function addReview(formData: Review) {
  console.log(formData);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user, " user");
  if (!user) {
    console.error("User is not authenticated in add Review server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from("item_reviews").insert([
    {
      posted_by: user?.id,
      item_id: formData?.food_id,
      name: user?.user_metadata?.full_name,
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
// update review on the Item
export async function updateReview(id: string, review: string) {
  const supabase = await createClient();

  const request = {};
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "User is not authenticated in updating Message server action"
    );
    return { message: "User not authenticated" };
  }
  const { data, error } = await supabase
    .from("item_reviews")
    .update({
      review: review,
    })
    .match({ id: id, posted_by: user.id });

  if (error) {
    console.log(request + "content");
    console.log(id, "id");
    console.error("Error updating message", error);
    return { status: 500, message: "Error updating message" };
  }
  // revalidatePath('/home')

  return { status: 200, message: "Success" };
}
