export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodosFilterStatus = 'All' | 'Completed' | 'Active';

export type TodoErrorMessages =
  | 'Unable to load todos'
  | 'Title should not be empty'
  | 'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo'
  | '';
