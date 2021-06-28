
export interface User {
  name: string;
  email: string;
  id: string;
  team: Team;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
}
