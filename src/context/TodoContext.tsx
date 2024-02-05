import React, { useState, useMemo, useEffect } from 'react';
import { Todo } from '../types/Todo';
import * as apiService from '../api/todos';
import { USER_ID } from '../variables/UserID';
import { FilterStatus } from '../types/Status';
import { filterTodoByStatus } from '../utils/FilteringByStatus';
import { TempTodo } from '../types/TempTodo';

interface ContextProps {
  todos: Todo[];
  status: FilterStatus;
  errorMessage: string;
  deletedId: number[];
  loading: boolean;
  title: string;
  tempTodo: TempTodo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedId: (n: number[]) => void;
  deleteTodos: (todoId: number) => void;
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void;
  filterTodoByStatus: (todoItems: Todo[], values: FilterStatus) => Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  clearTodo: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  status: FilterStatus.All,
  errorMessage: '',
  deletedId: [],
  title: '',
  loading: false,
  tempTodo: null,
  setTempTodo: () => {},
  setLoading: () => {},
  setTitle: () => {},
  setDeletedId: () => {},
  deleteTodos: () => {},
  setErrorMessage: () => {},
  setTodos: () => {},
  setStatus: () => [],
  filterTodoByStatus: () => [],
  clearTodo: () => [],
});

type Props = {
  children: React.ReactNode
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedId, setDeletedId] = useState<number[]>([])
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function loadTodos() {
    apiService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);

  function deleteTodos(todoId: number) {
    apiService.deleteTodos(todoId)
      .catch(() => {
        setErrorMessage('Unable to delete todo')
      });

    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  }

  const toggleAll = (completed: boolean) => {
    setTodos((prevTodos) => prevTodos.map((todo) => ({
      ...todo,
      completed,
    })));
  };

  const clearTodo = async () => {
    try {
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);
  
      await Promise.all(completedIds.map(id => apiService.deleteTodos(id)));
  
      setTodos((prevTodos) => prevTodos.filter(todo => !completedIds.includes(todo.id)));
    } catch (error) {
      setErrorMessage('Unable to delete todo');
    }
  
    setDeletedId([]);
  };

  const value = useMemo(() => ({
    todos,
    status,
    errorMessage, 
    deletedId,
    title,
    loading,
    tempTodo,
    setTempTodo,
    setLoading,
    setTitle,
    setDeletedId,
    deleteTodos,
    setErrorMessage,
    setStatus,
    setTodos,
    clearTodo,
    filterTodoByStatus,
    toggleAll,
  }), [todos, status, errorMessage, deletedId, title, tempTodo]); 

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};