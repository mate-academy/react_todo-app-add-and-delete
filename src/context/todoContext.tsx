/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-console */
import React, { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { SORT } from '../types/Sort';
import { client } from '../utils/fetchClient';

type Props = {
  children: React.ReactNode;
};

interface TodoContextType {
  inputValue: string;
  addNewTodoInput: (str: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  addTodo: (nextTodo: Todo) => void;
  todos: Todo[];
  handleCheck: (todoId: number) => void;
  handleDelete: (todoId: number) => void;
  countItemsLeft: () => number;
  countItemsCompleted: () => number;
  resetCompleted: () => void;
  currentFilter: SORT;
  setCurrentFilter: React.Dispatch<React.SetStateAction<SORT>>;
}

export const TodoContext = createContext<TodoContextType>({
  inputValue: '',
  addNewTodoInput: () => {},
  handleSubmit: () => {},
  addTodo: () => {},
  todos: [],
  handleCheck: () => {},
  handleDelete: () => {},
  countItemsLeft: () => 0,
  countItemsCompleted: () => 0,
  resetCompleted: () => {},
  currentFilter: SORT.ALL,
  setCurrentFilter: () => {},
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<SORT>(SORT.ALL);

  const USER_ID = 11238;

  const fetchTodosFromServer = async () => {
    try {
      const todosFromServer = await client.get<Todo[]>('/todos');
      const filteredTodos = todosFromServer.filter(
        (todo) => todo.userId === USER_ID,
      );

      setTodos(filteredTodos);
    } catch (error) {
      console.error('Failed to fetch todos from the server:', error);
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, []);

  const addTodo = (nextTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, nextTodo]);
  };

  const handleCheck = (todoId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDelete = (todoId: number) => {
    setTodos(todos.filter((todo) => todo.id !== todoId));
  };

  const addNewTodoInput = (str: string) => {
    setInputValue(str);
  };

  const countItemsLeft = () => {
    const notCompletedTask = todos.filter((todo) => todo.completed === false);

    return notCompletedTask.length;
  };

  const countItemsCompleted = () => {
    const completedTask = todos.filter((todo) => todo.completed === true);

    return completedTask.length;
  };

  const resetCompleted = () => {
    setTodos(todos.filter((todo) => todo.completed === false));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      userId: 11238,
      title: inputValue,
      completed: false,
    };

    addTodo(newTodo);
    setInputValue('');
  };

  const visibleTodos = todos.filter((todo) => {
    if (!todo.completed && currentFilter === SORT.COMPLETED) {
      return false;
    }

    if (todo.completed && currentFilter === SORT.ACTIVE) {
      return false;
    }

    return true;
  });

  const value = {
    inputValue,
    addNewTodoInput,
    handleSubmit,
    todos: visibleTodos,
    addTodo,
    handleCheck,
    handleDelete,
    countItemsLeft,
    resetCompleted,
    countItemsCompleted,
    currentFilter,
    setCurrentFilter,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
