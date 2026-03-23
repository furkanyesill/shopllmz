"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginSuperadmin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPass = process.env.ADMIN_PASSWORD || "shopllmz2026";
  
  if (password === adminPass) {
    (await cookies()).set("superadmin_auth", "true", { secure: true, httpOnly: true, maxAge: 86400 * 7 });
    redirect("/superadmin");
  } else {
    redirect("/superadmin?error=invalid");
  }
}
