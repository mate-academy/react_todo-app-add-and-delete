export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoWithoutId {
  userId: number;
  title: string;
  completed: boolean;
}
