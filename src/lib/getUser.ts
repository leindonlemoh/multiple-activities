// utils/supabase/getUser.js
import { createClient } from "@/utils/supabase/client";

export async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  if (data && data.user) {
    // You can adjust this as per your permissions logic
    return {
      id: data.user.id,
      name: data.user.user_metadata.full_name,
      email: data.user.email,
    };
  } else {
    return null;
  }
}
