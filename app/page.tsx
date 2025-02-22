import { supabase } from "@/lib/supabase";
import GreetingCardCarousel from "@/components/greeting-card-carousel";
import { User } from "@/types";
import { cookies } from "next/headers";
import Splash from "@/components/ui/splash";

// Fetch users on the server side
async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, team, tickets_completed, time_on_project, favourite_moment, comments(id, content, created_at, name)"
    )
    .order("id", { ascending: true }); // Keep users sorted normally
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map((user) => ({
    ...user,
    comments: user.comments
      ? user.comments.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ) // ✅ Sort comments by created_at manually
      : [],
  })) as User[];
}

export default async function Home() {
  const users = await fetchUsers();
  const cookieStore = await cookies();
  const storedName = cookieStore.get("username")?.value;

  return (
    <div className="h-screen overflow-hidden">
      {!storedName && <Splash />}
      <main>
        {storedName && (
          <GreetingCardCarousel users={users} username={storedName} />
        )}
      </main>
    </div>
  );
}
