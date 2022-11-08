export interface TodoToPost {
  userId: number;
  title: string;
  completed: boolean;
}

export interface Todo extends TodoToPost {
  id: number;
}
