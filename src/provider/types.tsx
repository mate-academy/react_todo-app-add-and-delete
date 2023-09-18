import { FormEvent } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export interface TodoContextType {
  todos: Todo[],
  error: Errors | null;
  filterTodos: FilterType;
  newTodoName: string | null;
  temptTodo: Todo | null;
  editedTodo: boolean;
  setNewTodoName: React.Dispatch<React.SetStateAction<string | null>>;
  handleShowError: (err: Errors) => void;
  handleSetFilterTodos: (filterType: FilterType) => void;
  closeErrorMessage: () => void,
  addNewTodo: (event: FormEvent<HTMLFormElement>) => void;
  removeTask: (task: Todo) => void;
  deleteCompleted: (tasks: Todo[]) => void;
}

export enum Errors {
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Title = 'Title can\'t be empty',
}

export type Props = React.PropsWithChildren<{}>;
