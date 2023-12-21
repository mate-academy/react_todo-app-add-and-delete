import {
  useCallback,
  useState,
  useMemo,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import * as TodoMethods from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TypeOfFilter } from '../../types/TypeOfFilters';
import { Error } from '../../types/TypeOfErrors';

const USER_ID = 12049;

interface AppContextTodoType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filter: TypeOfFilter,
  setFilter: React.Dispatch<React.SetStateAction<TypeOfFilter>>,
  errors: Error | null,
  setErrors: React.Dispatch<React.SetStateAction<Error | null>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  filteredTodos: Todo[],
  deleteTodoHandler: (value: number) => void,
  addTodoTitle: (todo: Omit<Todo, 'id'>) => Promise<void>,
}

export const appContext = createContext<AppContextTodoType>({
  USER_ID: 12049,
  todos: [],
  setTodos: () => { },
  filter: TypeOfFilter.All,
  setFilter: () => { },
  errors: null,
  setErrors: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  isLoading: false,
  setIsLoading: () => {},
  filteredTodos: [],
  deleteTodoHandler: () => {},
  addTodoTitle: async () => {},
});

type Props = {
  children: ReactNode;
};

export const AppContextProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TypeOfFilter>(TypeOfFilter.All);
  const [errors, setErrors] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTodos = useMemo(() => {
    if (filter === TypeOfFilter.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === TypeOfFilter.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  useEffect(() => {
    TodoMethods.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrors(Error.LoadTodos));
  }, []);

  const deleteTodoHandler = useCallback(
    (todoId: number) => {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return TodoMethods.deleteTodo(todoId)
        .catch(() => {
          setErrors(Error.DeleteTodo);
          setTodos(todos);
        });
    }, [todos],
  );

  const addTodoTitle = useCallback(
    ({ title, completed, userId }: Omit<Todo, 'id'>) => {
      setTempTodo({
        id: 0,
        title,
        completed,
        userId,
      });

      setIsLoading(true);

      return TodoMethods.addTodo({ title, completed, userId })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch(() => {
          setErrors(Error.AddTodo);
        })
        .finally(() => setTempTodo(null));
    }, [],
  );

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    filter,
    setFilter,
    errors,
    setErrors,
    tempTodo,
    setTempTodo,
    addTodoTitle,
    deleteTodoHandler,
    filteredTodos,
    isLoading,
    setIsLoading,
  }), [
    todos,
    filter,
    errors,
    tempTodo,
    addTodoTitle,
    deleteTodoHandler,
    filteredTodos,
    isLoading,
  ]);

  return (
    <appContext.Provider value={value}>
      {children}
    </appContext.Provider>
  );
};
