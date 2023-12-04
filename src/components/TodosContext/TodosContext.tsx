import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';

import * as todoService from '../../api/todos';
import { FilterTodos } from '../../types/FilterTodos';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

const USER_ID = 11986;

type DefaultCotextValue = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo) => void,
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>,
  deleteTodo: (todoId: number) => void,
  isSubmiting: boolean,
  setIsSubmiting: (value: boolean) => void,
  filterTodos: FilterTodos,
  setFilterTodos: (filter: FilterTodos) => void,
  visibleTodos: Todo[],
  errorMessage: Error,
  setErrorMessage: (err: Error) => void,
  USER_ID: number,
};

export const TodosContext = createContext<DefaultCotextValue>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  isSubmiting: false,
  setIsSubmiting: () => {},
  filterTodos: FilterTodos.All,
  setFilterTodos: () => {},
  visibleTodos: [],
  errorMessage: Error.Default,
  setErrorMessage: () => {},
  USER_ID,
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterTodos, setFilterTodos] = useState<FilterTodos>(FilterTodos.All);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Default);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.CantLoad));
  }, []);

  const addTodo = useCallback(
    ({ title, userId, completed }: Omit<Todo, 'id'>) => {
      setErrorMessage(Error.Default);

      setTempTodo({
        title, userId, completed, id: 0,
      });

      setIsSubmiting(true);

      return todoService.createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch((error) => {
          setErrorMessage(Error.Add);
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }, [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (filterTodos) {
      case FilterTodos.Active:
        return todos.filter(todo => !todo.completed);

      case FilterTodos.Completed:
        return todos.filter(todo => todo.completed);

      case FilterTodos.All:
      default:
        return todos;
    }
  }, [filterTodos, todos]);

  const deleteTodo = useCallback((todoId: number) => {
    setErrorMessage(Error.Default);

    const filteredTodos = todos
      .filter(currentTodo => currentTodo.id !== todoId);

    setTodos(filteredTodos);

    return todoService.deleteTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Error.Delete);
        throw error;
      });
  }, [todos]);

  const value = useMemo(() => ({
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    isSubmiting,
    setIsSubmiting,
    filterTodos,
    setFilterTodos,
    visibleTodos,
    errorMessage,
    setErrorMessage,
    USER_ID,
  }), [
    todos, setTodos, tempTodo, setTempTodo, addTodo, deleteTodo, isSubmiting,
    setIsSubmiting, filterTodos, visibleTodos, errorMessage, setErrorMessage,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
