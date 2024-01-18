/* eslint-disable max-len */
/* eslint-disable no-console */
import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { SORT } from '../types/Sort';
import { client } from '../utils/fetchClient';
import { TodoError } from '../types/TodoError';

type Props = {
  children: React.ReactNode;
};

interface TodoContextType {
  inputValue: string;
  addNewTodoInput: (str: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todos: Todo[];
  handleCheck: (todoId: number) => void;
  handleDeleteTodo: (todoId: number) => void;
  countItemsLeft: () => number;
  itemsLeft: number;
  countItemsCompleted: () => number;
  itemsCompleted: number;
  resetCompleted: () => void;
  currentFilter: SORT;
  setCurrentFilter: React.Dispatch<React.SetStateAction<SORT>>;
  errorMessage: TodoError;
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoError>>;
  loading: number[];
  tempTodo: Todo | null;
}

export const TodoContext = createContext<TodoContextType>({
  inputValue: '',
  addNewTodoInput: () => {},
  handleSubmit: () => {},
  todos: [],
  handleCheck: () => {},
  handleDeleteTodo: () => {},
  countItemsLeft: () => 0,
  itemsLeft: 0,
  countItemsCompleted: () => 0,
  itemsCompleted: 0,
  resetCompleted: () => {},
  currentFilter: SORT.ALL,
  setCurrentFilter: () => {},
  errorMessage: TodoError.empty,
  setErrorMessage: () => {},
  loading: [],
  tempTodo: null,
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<SORT>(SORT.ALL);
  const [errorMessage, setErrorMessage] = useState(TodoError.empty);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<number[]>([]);

  const USER_ID = 11238;

  const fetchTodosFromServer = async () => {
    try {
      const todosFromServer = await client.get<Todo[]>('/todos');
      const filteredTodos = todosFromServer.filter(
        (todo) => todo.userId === USER_ID,
      );

      setTodos(filteredTodos);
    } catch {
      setErrorMessage(TodoError.load);
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, []);

  const addNewTodoInput = (str: string) => {
    setInputValue(str);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(TodoError.emptyTodo);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: inputValue,
      completed: false,
      id: 0,
    };

    setTempTodo(newTodo);
    setLoading([0]);

    try {
      const response = await client.post<Todo>('/todos', newTodo);

      setTodos((prevTodos) => [...prevTodos, response]);
    } catch {
      setErrorMessage(TodoError.add);
    } finally {
      setLoading([]);
      setTempTodo(null);
      setInputValue('');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoading([todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      setErrorMessage(TodoError.empty);
    } catch {
      setErrorMessage(TodoError.delete);
    } finally {
      setLoading([]);
    }
  };

  const handleCheck = (todoId: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)));
  };

  const countItemsLeft = () => {
    const notCompletedTask = todos.filter((todo) => todo.completed === false);

    return notCompletedTask.length;
  };

  const countItemsCompleted = () => {
    const completedTask = todos.filter((todo) => todo.completed === true);

    return completedTask.length;
  };

  const itemsLeft = useMemo(countItemsLeft, [todos]);
  const itemsCompleted = useMemo(countItemsCompleted, [todos]);

  const resetCompleted = () => {
    setTodos(todos.filter((todo) => todo.completed === false));
  };

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (!todo.completed && currentFilter === SORT.COMPLETED) {
        return false;
      }

      if (todo.completed && currentFilter === SORT.ACTIVE) {
        return false;
      }

      return true;
    });
  }, [todos, currentFilter]);

  const value = {
    inputValue,
    addNewTodoInput,
    handleSubmit,
    todos: visibleTodos,
    handleCheck,
    handleDeleteTodo,
    countItemsLeft,
    itemsLeft,
    resetCompleted,
    countItemsCompleted,
    itemsCompleted,
    currentFilter,
    setCurrentFilter,
    errorMessage,
    setErrorMessage,
    loading,
    tempTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
