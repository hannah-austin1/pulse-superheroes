"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addComment(
  userId: string,
  name: string,
  content: string
) {
  if (!name.trim() || !content.trim())
    return { error: "Name and comment cannot be empty" };

  const { data, error } = await supabase
    .from("comments")
    .insert([{ user_id: userId, name, content }]);

  if (error) return { error: error.message };

  // Revalidate the page so the updated comments appear
  revalidatePath("/");

  return { success: true, comment: data };
}
