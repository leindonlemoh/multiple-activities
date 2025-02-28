"use server";
import { createClient } from "@/utils/supabase/server";

type Notes = {
  note: string;
  date: string;
  priority:string;
  color: string;
};

export async function addNotes(formData: Notes) {
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

  const { error } = await supabase.from("notes").insert([
    {
      note: formData?.note,
      expiration_date: formData?.date,
      color: formData?.color,
      priority: formData?.priority,
      posted_by: user?.id,
    },
  ]);

  if (error) {
    console.error("Error inserting message", error);
    return { status: 500, message: "Error inserting message" };
  }

  return { status: 200, message: "Success" };
}

export async function updateNote(formData: any) {
  const supabase = await createClient();
  console.log(formData);
  const id = formData?.id;

  const request = {
    note: formData?.note,
    priority:formData?.priority,
    is_done: formData?.is_done,
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
    .from("notes")
    .update({
      ...request,
    })
    .match({ id: id, posted_by: user.id });

  if (error) {
    console.log(request + "content");
    console.log(id, "id");
    console.error("Error updating message", error);
    return { status: 500, message: "Error updating message" };
  }

  return { status: 200, message: "Success" };
}
