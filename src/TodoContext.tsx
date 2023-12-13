import React, { useEffect, useState } from 'react';
import * as API from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoErrors } from './types/TodoErrors';

const USER_ID = 12003;

type GlobalContexTypes = {
  USER_ID: number,
  getTodoList: () => Promise<Todo[]>,
  postNewTodo: (data: Omit<Todo, 'id'>) => Promise<Todo>,
  deleteTodoItem: (todoId: number) => Promise<number>,
  todos: [],
  setTodos: (todos: Todo[]) => {},
  filter: Filter,
  setFilter: (filter: Filter) => {},
  filteredTodos: [],
  setFilteredTodos: (filteredTodos: Todo[]) => {},
  error: string,
  setError: (error: string) => {},
  tempTodo: null,
  setTempTodo: (tempTodo: Omit<Todo, 'userId'> | null) => {},
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => {},
};

type GlobalContextProps = {
  USER_ID: number,
  getTodoList: () => Promise<Todo[]>,
  postNewTodo: (data: Omit<Todo, 'id'>) => Promise<Todo>,
  deleteTodoItem: (todoId: number) => Promise<number>,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: Filter,
  setFilter: (filter: Filter) => void,
  filteredTodos: Todo[],
  setFilteredTodos: (filteredTodos: Todo[]) => void,
  error: string,
  setError: (error: string) => void,
  tempTodo: Omit<Todo, 'userId'> | null,
  setTempTodo: (tempTodo: Omit<Todo, 'userId'> | null) => void,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
};

export const GlobalContex = React.createContext<GlobalContextProps>(
  {} as GlobalContexTypes,
);

type GlobalProviderProps = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTodoList = async (): Promise<Todo[]> => API.getTodos(USER_ID);
  const postNewTodo = async (data: Omit<Todo, 'id'>): Promise<Todo> => {
    return API.addTodo(data);
  };

  const deleteTodoItem = async (todoId: number): Promise<number> => {
    return API.deleteTodo(todoId);
  };

  useEffect(() => {
    setError('');
    getTodoList()
      .then(todoList => {
        setTodos(todoList);
        setFilteredTodos(todoList);
      })
      .catch(() => setError(TodoErrors.Load));
  }, []);

  useEffect(() => {
    switch (filter) {
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      case Filter.All:
      default:
        setFilteredTodos(todos);
    }
  }, [todos, filter]);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  const globalContextValue = {
    USER_ID,
    getTodoList,
    postNewTodo,
    deleteTodoItem,
    todos,
    setTodos,
    filter,
    setFilter,
    filteredTodos,
    setFilteredTodos,
    error,
    setError,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
  };

  return (
    <GlobalContex.Provider value={globalContextValue}>
      {children}
    </GlobalContex.Provider>
  );
};
