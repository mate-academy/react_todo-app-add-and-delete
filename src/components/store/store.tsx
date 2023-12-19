import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { ProviderProps } from '../../types/ProviderProps';
import { FilterOption } from '../../enum/FilterOption';
import { useTodosFilter } from '../../helpers/useTodosFilter';
import { ErrorOption } from '../../enum/ErrorOption';

type TodosContextType = {
  todos: Todo[],
  hasError: ErrorOption;
  resetHasError: () => void;
  setError: (errMessage: ErrorOption) => void;
  addTodo: (newTodo: Todo) => void;
  removeTodo: (todoId: number) => void;
  recieveTodos: (newTodos: Todo[]) => void,
  setFilterSelected: (filter: FilterOption) => void,
  filterSelected: FilterOption,
  filteredTodos: Todo[],
  toggleTodoCondition: (todoId: number) => void,
  resetDeletingTodoIds: () => void,
  addDeletingTodoIds: (newTodoIds: number[]) => void,
  deletingTodoIds: number[],
};

const TodosContext = createContext<TodosContextType>({
  todos: [],
  hasError: ErrorOption.Clear,
  resetHasError: () => {},
  setError: () => {},
  addTodo: () => {},
  removeTodo: () => {},
  recieveTodos: () => {},
  setFilterSelected: () => {},
  filterSelected: FilterOption.All,
  filteredTodos: [],
  toggleTodoCondition: () => {},
  resetDeletingTodoIds: () => {},
  addDeletingTodoIds: () => {},
  deletingTodoIds: [],
});

export const TodosContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(ErrorOption.Clear);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [
    filterSelected,
    setFilterSelected,
  ] = useState<FilterOption>(FilterOption.All);

  const recieveTodos = useCallback(
    (newTodos: Todo[]) => {
      setTodos(newTodos);
    },
    [],
  );

  const filteredTodos = useTodosFilter({ todos, filterSelected });

  const resetDeletingTodoIds = () => {
    setDeletingTodoIds([]);
  };

  const addDeletingTodoIds = (newTodoIds: number[]) => {
    setDeletingTodoIds(prevTodoIds => [...prevTodoIds, ...newTodoIds]);
  };

  const resetHasError = useCallback(
    () => setHasError(ErrorOption.Clear),
    [],
  );

  const setError = useCallback(
    (errMessage: ErrorOption) => {
      setHasError(errMessage);

      setTimeout(() => resetHasError(), 3000);
    },
    [resetHasError],
  );

  const addTodo = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const removeTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const toggleTodoCondition = (todoId: number) => {
    // some time ago i can implement status for 'allToggleBtn'
    // and toggle 'todo.completed' based on that status 👀
    // comment for future development

    const findedTodo = todos.find(todo => todo.id === todoId) || null;

    if (!findedTodo) {
      return;
    }

    const newTodo = {
      ...findedTodo,
      completed: !findedTodo.completed,
    };

    const copyTodos = [...todos];
    const indexFindedTodo = copyTodos.indexOf(findedTodo);

    copyTodos[indexFindedTodo] = newTodo;

    setTodos(copyTodos);
  };

  const TodosProviderValue: TodosContextType = {
    todos,
    addTodo,
    hasError,
    setError,
    removeTodo,
    recieveTodos,
    filteredTodos,
    resetHasError,
    filterSelected,
    deletingTodoIds,
    setFilterSelected,
    addDeletingTodoIds,
    toggleTodoCondition,
    resetDeletingTodoIds,
  };

  return (
    <TodosContext.Provider value={TodosProviderValue}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => useContext(TodosContext);
