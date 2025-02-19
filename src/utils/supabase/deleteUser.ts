"use server";
import { createClient } from "@/utils/supabase/server";

export async function deleteUser(id: any) {
  const supabase = await createClient(); // For anon access
  const from = "auth.users";
  // If you're deleting a user from `auth.users`, use the service role key
  if (from === "auth.users") {
    const supabaseService = await createClient(true); // Use service role for deleting user

    const {
      data: { user },
    } = await supabaseService.auth.getUser();
    if (!user) {
      console.error(
        "User is not authenticated in delete Message server action"
      );
      return { message: "User not authenticated" };
    }

    try {
      // Delete the user from auth.users using the new method
      const { error } = await supabaseService.auth.admin.deleteUser(user.id);

      if (error) {
        console.error("Error deleting user from auth", error);
        return {
          status: 500,
          message: `Error deleting user: ${error.message}`,
        };
      }

      return { status: 200, message: "User account deleted successfully" };
    } catch (error) {
      console.error("Unexpected error occurred", error);
      return { status: 500, message: "An unexpected error occurred" };
    }
  }

  // Handle deletion for other tables (non-auth data)
  const { error } = await supabase.from(from).delete().match({ id: id });

  if (error) {
    console.error("Error deleting record", error);
    return { status: 500, message: `Error deleting record: ${error.message}` };
  }

  return { status: 200, message: "Record deleted successfully" };
}
