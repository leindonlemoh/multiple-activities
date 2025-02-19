"use server";
import { createClient } from "@/utils/supabase/server";

export async function deleteData(from: string, id: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User is not authenticated in delete Message server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from(from).delete().match({ id: id });

  if (error) {
    console.error("Error deleting message", error);
    return { status: 500, message: `Error inserting message ${error}` };
  }

  return { status: 200, message: "Success" };
}
