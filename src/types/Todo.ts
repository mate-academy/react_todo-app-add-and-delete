export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoPatchProps = { [key in keyof Omit<Todo, 'id'>]?: Todo[key] };
