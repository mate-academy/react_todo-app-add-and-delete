export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type PartialTodo = Partial<Todo>;

export const isTodo = (item: Todo | object): item is Todo => {
  return (item as Todo).completed !== undefined;
};
