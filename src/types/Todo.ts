export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TempTodo = {
  id: 0;
  title: string;
  completed: boolean;
};
