export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoData {
  title: string;
  userId: number;
  completed: boolean;
}
