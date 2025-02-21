export interface User {
  id: string;
  name: string;
  created_at: string;
  team: string;
  joinDate: string;
  favourite_moment: string;
  tickets_completed: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  name?: string;
  created_at: string;
}
