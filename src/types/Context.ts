import { StateFilter } from './StateFilter';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  selectedState: StateFilter,
  setSelectedState: React.Dispatch<React.SetStateAction<StateFilter>>
}
