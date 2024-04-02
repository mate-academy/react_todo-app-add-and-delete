import { Dispatch, SetStateAction, createContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../enums/Errors';
import { FilterOptions } from '../enums/FilterOptions';
import { getFilteredTodos } from '../helpers/getFilteredTodos';
import { deleteTodos } from '../api/todos';
import { getErrors } from '../helpers/getErorrs';

export type TodoContext = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  preparedTodos: Todo[];
  errorMessage: Errors | null;
  setErrorMessage: Dispatch<SetStateAction<Errors | null>>;
  filterSelected: FilterOptions;
  setFilterSelected: Dispatch<SetStateAction<FilterOptions>>;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  loadingTodoIds: number[];
  setLoadingTodoIds: Dispatch<SetStateAction<number[]>>;
  shouldFocus: boolean;
  setShouldFocus: Dispatch<SetStateAction<boolean>>;
};

export const TodosContext = createContext<TodoContext | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterSelected, setFilterSelected] = useState<FilterOptions>(
    FilterOptions.all,
  );
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [shouldFocus, setShouldFocus] = useState(true);

  const preparedTodos = getFilteredTodos(todos, filterSelected);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  function onDelete(todoId: number) {
    setLoadingTodoIds(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        getErrors(Errors.DeleteTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setShouldFocus(true);
      });
  }

  const contextValues = {
    todos,
    setTodos,
    completedTodos,
    activeTodos,
    preparedTodos,
    filterSelected,
    setFilterSelected,
    errorMessage,
    setErrorMessage,
    onDelete,
    tempTodo,
    setTempTodo,
    loadingTodoIds,
    setLoadingTodoIds,
    shouldFocus,
    setShouldFocus,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};
