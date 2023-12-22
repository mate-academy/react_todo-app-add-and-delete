export interface Todo {
  id: TodoID;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoID = number;
