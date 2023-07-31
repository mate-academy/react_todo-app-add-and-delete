/* eslint-disable max-len */
import React, {
  ReactNode, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';

export const USER_ID = 11120;

export enum StateOption {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export enum ErrorOption {
  FetchErr = 'Unable to upload todos',
  TitleErr = 'Title can not be empty',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
  UpdateError = 'Unable to update a todo',
}

type Props = {
  children: ReactNode;
};

interface ContextValues {
  todos: Todo[],
  selectedTodo: Todo | null,
  visibleTodos: Todo[],
  activeTodosAmount: number,
  error: string | null,
  filter: string,
  loading: boolean,
  todoInCreation: Todo | null,
  setTodoInCreation: React.Dispatch<React.SetStateAction<Todo | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setError: React.Dispatch<React.SetStateAction<ErrorOption | null>>,
  setFilter: React.Dispatch<React.SetStateAction<StateOption>>,
  deleteTodo: (todoId: number) => void,
  addTodo: (todoTitle: string) => Promise<boolean>,
  handleClearCompleted: () => void,
}

export const TodoContext = React.createContext({} as ContextValues);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoInCreation, setTodoInCreation] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<StateOption>(StateOption.all);
  const [error, setError] = useState<ErrorOption | null>(null);

  useEffect(() => {
    setLoading(true);

    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorOption.FetchErr))
      .finally(() => setLoading(false));
  }, []);

  const filterTodos = (
    array: Todo[], selectedFilterOption: StateOption,
  ) => {
    const filteredArray = array.filter(todo => {
      switch (selectedFilterOption) {
        case StateOption.active:
          return !todo.completed;
        case StateOption.completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    return filteredArray;
  };

  const addTodo = (todoTitle: string) => {
    const newTodo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodoInCreation(newTodo);

    return todosService.postTodo(newTodo)
      .then(todo => {
        setTodos(curTodos => [...curTodos, todo]);
        setError(null);

        return true;
      })
      .catch(() => {
        setError(ErrorOption.AddError);

        return false;
      })
      .finally(() => {
        setTodoInCreation(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    todosService.deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId)))
      .catch(() => setError(ErrorOption.DeleteError))
      .finally(() => setLoading(false));
  };

  const handleClearCompleted = useCallback(() => {
    todos.map(todo => (todo.completed ? deleteTodo(todo.id) : todo));
  }, [todos]);

  const visibleTodos: Todo[] = useMemo(() => filterTodos(todos, filter),
    [todos, filter]);

  const activeTodosAmount = todos.filter(todo => !todo.completed).length;

  const contextValues: ContextValues = useMemo(() => ({
    todos,
    visibleTodos,
    activeTodosAmount,
    error,
    setError,
    filter,
    loading,
    todoInCreation,
    setTodoInCreation,
    setLoading,
    setFilter,
    selectedTodo,
    setSelectedTodo,
    deleteTodo,
    addTodo,
    handleClearCompleted,
  }), [
    visibleTodos,
    selectedTodo,
    activeTodosAmount,
    error,
    filter,
  ]);

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
};
