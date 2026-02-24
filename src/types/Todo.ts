/**
 * Interface representing a Todo item from the API
 */
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
