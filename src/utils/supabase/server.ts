import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Function to create Supabase client
export async function createClient(isServiceRole: boolean = false) {
  const cookieStore = await cookies();

  // Check if we're performing an operation that requires Service Role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // If Service Role access is needed, use Service Role API key
  if (isServiceRole && serviceRoleKey) {
    return createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error
          }
        },
      },
    });
  }

  // Default to using Anon key for regular access
  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Handle error
        }
      },
    },
  });
}
