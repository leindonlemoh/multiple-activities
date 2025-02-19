import { createClient } from "@/utils/supabase/client";

// General-purpose fetch function that can handle dynamic conditions
export const fetchData = async (
  from: string,
  conditions: Record<string, any> = {}
) => {
  const supabase = createClient();

  let query = supabase
    .from(from)
    .select("*")
    .order("created_at", { ascending: false });

  for (const [key, value] of Object.entries(conditions)) {
    query = query.eq(key, value);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
