"use server";

import { createClient } from "@/utils/supabase/server";
type Credentials = {
  email: string;
  password: string;
};
export async function login(formData: Credentials) {
  const supabase = await createClient();
  console.log(formData, "form");
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData?.email as string,
    password: formData?.password as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  // if (error) {
  //   redirect('/error')

  // }
  if (error) {
    return { status: 500, message: error?.message };
  } else {
    return { status: 200, message: "Successfully Logged In" };
  }
  // revalidatePath('/home', 'layout')
  // redirect('/home')
}
type SignupResponse = {
  status: number;
  message?: string;
  data?: any;
};

export async function signup(userInfo: any): Promise<SignupResponse> {
  const supabase = await createClient();
  console.log(userInfo, "sss");
  const firstName = userInfo.firstName;
  const lastName = userInfo.lastName;

  const data = {
    email: userInfo.email,
    password: userInfo.password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        email: userInfo.email,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { status: 500, message: error.message };
  }

  return { status: 200, message: "Signup successful!" };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  // if (error) {
  //   redirect('/error')
  // }

  if (error) {
    return { status: 500, message: error.message };
  }

  return { status: 200, message: "Signed Out" };
}
