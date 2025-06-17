import { ToDoServiceErrors } from '../hooks/useTodos';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoError =
  (typeof ToDoServiceErrors)[keyof typeof ToDoServiceErrors];
