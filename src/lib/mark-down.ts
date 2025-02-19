"use server";
import { createClient } from "@/utils/supabase/server";

export async function addMarkDown() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    console.error("User is not authenticated in add Item server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from("mark_down_notes").insert([
    {
      title: "",
      content: "",
      posted_by: user?.id,
    },
  ]);

  if (error) {
    console.error("Error inserting Notes", error);
    return { status: 500, message: "Error inserting DATA" };
  }

  return { status: 200, message: "Success" };
}
type Notes = {
  title?: string;
  content?: string;
  id?: number;
};

export async function updateMarkDown(datas: Notes) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "User is not authenticated in updating Message server action"
    );
    return { message: "User not authenticated" };
  }

  const updateData: { title?: string; content?: string } = {};

  if (datas.title) {
    updateData.title = datas.title;
  }

  if (datas.content) {
    updateData.content = datas.content;
  }

  if (!updateData.title && !updateData.content) {
    return { status: 400, message: "No data to update" };
  }

  const { data, error } = await supabase
    .from("mark_down_notes")
    .update(updateData)
    .match({ id: datas?.id, posted_by: user.id });

  if (error) {
    console.error("Error updating item", error);
    return { status: 500, message: "Error updating Item" };
  }

  return { status: 200, message: "Update successful", data };
}
