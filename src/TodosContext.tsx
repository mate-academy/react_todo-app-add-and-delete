import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/FilterStatus';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorContext } from './ErrorContext';

const USER_ID = 11592;

export type State = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  addNewTodo: (todo: Omit <Todo, 'id'>) => Promise<void>,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  filterTodos: (status: Status) => Todo[],
  removeTodo: (id: number) => Promise<void>,
  loadingMap: { [key: number]: boolean } | {},
};

export const TodosContext = React.createContext<State>({
  todos: [],
  setTodos: () => {},
  addNewTodo: async () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filterTodos: () => [],
  removeTodo: async () => {},
  loadingMap: {},
});

interface Props {
  children: React.ReactNode,
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});

  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  function addNewTodo(createdTodo: Omit <Todo, 'id'>) {
    return addTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((err) => {
        setError('Unable to add a todo');
        throw (err);
      })
      .finally(() => setTempTodo(null));
  }

  const filterTodos = (fitlerParam: Status) => {
    switch (fitlerParam) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingMap(prevMap => ({
      ...prevMap,
      [id]: true,
    }));

    return deleteTodo(id)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => {
        setError('Unable to delete a todo');
        setIsLoading(false);
        setLoadingMap({});
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingMap(prevMap => ({
          ...prevMap,
          [id]: false,
        }));
      });
  };

  const value = useMemo(() => ({
    todos,
    setTodos,
    addNewTodo,
    isLoading,
    setIsLoading,
    tempTodo,
    setTempTodo,
    filterTodos,
    removeTodo,
    loadingMap,
  }), [todos, tempTodo, isLoading]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
