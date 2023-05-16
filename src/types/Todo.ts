export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoAdd {
  title: string;
  userId: number;
  completed: boolean;
}
