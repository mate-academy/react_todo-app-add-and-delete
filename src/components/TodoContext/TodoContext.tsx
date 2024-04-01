import { Dispatch, SetStateAction, createContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../enums/Errors';
import { FilterOptions } from '../../enums/FilterOptions';
import { hendleFilteredTodos } from '../../helpers/hendleFilteredTodos';

export type TodoContext = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  preparedTodos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  errorMessage: Errors | null;
  setErrorMessage: Dispatch<SetStateAction<Errors | null>>;
  filterSelected: FilterOptions;
  setFilterSelected: Dispatch<SetStateAction<FilterOptions>>;
};

export const TodosContext = createContext<TodoContext | undefined>(undefined);

type TodosContextProviderProps = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<TodosContextProviderProps> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterSelected, setFilterSelected] = useState<FilterOptions>(
    FilterOptions.all,
  );

  const preparedTodos = hendleFilteredTodos(todos, filterSelected);
  const activeTodos = hendleFilteredTodos(todos, FilterOptions.active);
  const completedTodos = hendleFilteredTodos(todos, FilterOptions.completed);

  const contextValues = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filterSelected,
    setFilterSelected,
    preparedTodos,
    activeTodos,
    completedTodos,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};
