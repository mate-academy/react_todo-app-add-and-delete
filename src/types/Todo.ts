export type TodoBase = {
  title: string;
  completed: boolean;
  userId: number;
};

export interface Todo extends TodoBase {
  id: number;
}
