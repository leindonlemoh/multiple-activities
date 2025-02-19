"use server";
import { createClient } from "@/utils/supabase/server";

type Item = {
  name: string;
  image_url: string;
};
// add new ITEM to g-drive
export async function addPhotoGDrive(formData: Item) {
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

  const { error } = await supabase.from("gdrive").insert([
    {
      uploaded_by: user?.id,
      name: formData?.name,
      image_url: formData?.image_url,
    },
  ]);

  if (error) {
    console.error("Error inserting DATA", error);
    return { status: 500, message: "Error inserting DATA" };
  }

  return { status: 200, message: "Success" };
}
type Update = {
  id: string;
  name: string;
  image_url: string;
};
// update Item
export async function updatePhotoGdrive(formData: Update) {
  const supabase = await createClient();
  console.log(formData);
  const id = formData?.id;

  const request = {
    id: formData?.id,
    name: formData?.name,
    image_url: formData?.image_url,
  };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User is not authenticated in updating Photo server action");
    return { message: "User not authenticated" };
  }
  const { data, error } = await supabase
    .from("gdrive")
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
