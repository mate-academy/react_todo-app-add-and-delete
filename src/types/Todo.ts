export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoData {
  userId: number;
  title: string;
  completed: boolean;
}
