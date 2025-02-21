import { supabase } from "@/lib/supabase";
import GreetingCardCarousel from "@/components/greeting-card-carousel";
import { User } from "@/types";
import HeroHeader from "@/components/ui/header";

// Fetch users on the server side
async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, team, tickets_completed, time_on_project, favourite_moment, comments(id, content, created_at, name)"
    )
    .order("created_at", { foreignTable: "comments", ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data as User[];
}

export default async function Home() {
  const users = await fetchUsers();

  return (
    <div className="h-screen">
      <HeroHeader />
      <main>
        <GreetingCardCarousel users={users} />
      </main>
    </div>
  );
}
