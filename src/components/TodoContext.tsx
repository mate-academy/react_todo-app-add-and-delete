import React, { useState, useEffect } from 'react';
import { Status } from '../types/StatusEnum';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';
import { TodoContextType } from '../types/TodosContext';
import { USER_ID_API } from '../constants/constants';
import { ErrorMessage } from '../types/ErrorMessage';

export const TodosContext = React.createContext<TodoContextType>({
  todos: [],
  addTodo: () => { },
  toggleTodo: () => { },
  deleteTodo: () => { },
  updateTodoTitle: () => { },
  deleteCompletedTodos: () => { },
  incompletedTodosCount: 0,
  hasCompletedTodos: false,
  filterTodos: () => [],
  errorMessage: ErrorMessage.DEFAULT,
  setErrorMessage: () => {},
  hideError: () => { },
  setIsProcessing: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [, setIsProcessing] = useState<number[]>([]);

  const hideError = () => {
    setTimeout(() => setErrorMessage(ErrorMessage.DEFAULT), 3000);
  };

  const addTodo = (title: string): Promise<void> => {
    const newTask: {
      id: number;
      completed: boolean;
      title: string;
      userId: number
    } = {
      id: todos.length + 1,
      title,
      completed: false,
      userId: USER_ID_API,
    };

    return postService.createTodo(newTask)
      .then(() => {
        setTodos([...todos, newTask]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD_ERROR);
      });
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(
      (todo) => (todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo),
    ));
  };

  const deleteTodo = (todoId: number) => {
    setIsProcessing(currentIds => [...currentIds, todoId]);
    const prevTodos = [...todos];

    return postService.deletePost(todoId)
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(prevTodos);
        setErrorMessage(ErrorMessage.DELETE_ERROR);
        throw error;
      })
      .finally(() => setIsProcessing([]));
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    setTodos(todos.map(prevTodo => (prevTodo.id === id
      ? { ...prevTodo, title: newTitle }
      : prevTodo)));
  };

  const deleteCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const incompletedTodosCount = todos.filter(
    (todo) => !todo.completed,
  ).length;

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const filterTodos = (filterStatus: string) => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      case Status.All:
      default:
        return todos;
    }
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    const todosToStore = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    }));

    localStorage.setItem('todos', JSON.stringify(todosToStore));
  }, [todos]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodoTitle,
        deleteCompletedTodos,
        incompletedTodosCount,
        hasCompletedTodos,
        filterTodos,
        errorMessage,
        setErrorMessage,
        hideError,
        setIsProcessing,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
