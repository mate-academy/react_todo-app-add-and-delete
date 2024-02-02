import { Status } from './Status';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  filterTodos: Status,
  setFilterTodos: (filterField: Status) => void,
}

export interface ContextUpdate {
  addTodo: (todo: Todo) => void,
  deleteTodo: (todoId: number) => void,
  // editTodo: (titleId: number, editTitle: string) => void,
  // clearCompleted: () => void,
}
