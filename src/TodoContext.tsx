import React, { useMemo, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types';
import { DELETE_ERROR } from './utils/constants';
import { pickCompletedTodos } from './utils/pickUncompletedTodos';

interface TodoContextType {
  todoItems: Todo[];
  setTodoItems: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  deleteTodo: (id: number) => void;
  completedTodos: Todo[];
  clearAllCompleted: () => void;
  uncompletedTodosLength: number;
  todoIdsToDelete: number[];
  setTodoIdsToDelete: (todoIdsToDelete: number[]) => void;
}

const todoContext: TodoContextType = {
  todoItems: [],
  setTodoItems: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  deleteTodo: () => {},
  completedTodos: [],
  clearAllCompleted: () => {},
  uncompletedTodosLength: 0,
  todoIdsToDelete: [],
  setTodoIdsToDelete: () => {},
};

export const TodoContext = React.createContext(todoContext);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([]);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setTodoIdsToDelete(prevState => [...prevState, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => setTodoItems(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch((error) => {
        setErrorMessage(DELETE_ERROR);
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const completedTodos = pickCompletedTodos(todoItems);

  const clearAllCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id));
  };

  const uncompletedTodosLength = todoItems.length
  - completedTodos.length;

  const value = useMemo(() => ({
    todoItems,
    setTodoItems,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    deleteTodo,
    completedTodos,
    clearAllCompleted,
    uncompletedTodosLength,
    todoIdsToDelete,
    setTodoIdsToDelete,
  }), [todoItems, errorMessage, isLoading, tempTodo]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
