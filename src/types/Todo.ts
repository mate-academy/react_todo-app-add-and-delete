export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoToPost {
  userId: number;
  title: string;
  completed: boolean;
}
