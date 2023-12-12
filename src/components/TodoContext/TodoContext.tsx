import React, { useEffect, useState, useMemo } from 'react';

import * as postService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Filter } from '../../types/Filter';

type Props = {
  children: React.ReactNode;
};

interface TodoContextType {
  USER_ID: number,
  todos: Todo[],
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  errorMessage: string,
  isSelected: string,
  isLoading: null | number,
  addTodo: (newTodo: Todo) => void,
  filterTodo: (filter: string) => void,
  deleteTodo: (todoId: number) => void
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsSelected: React.Dispatch<React.SetStateAction<string>>,
  setIsLoading: React.Dispatch<React.SetStateAction<number | null>>
}

const initialTodoContext = {
  USER_ID: 11906,
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filteredTodos: [],
  setFilteredTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  isSelected: 'All',
  setIsSelected: () => {},
  isLoading: null,
  setIsLoading: () => {},
  addTodo: () => {},
  filterTodo: () => {},
  deleteTodo: () => {},
};

const USER_ID = 11906;

export const TodoContext = React.createContext<
TodoContextType
>(initialTodoContext);

export const TodoProvider:React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isSelected, setIsSelected] = useState('All');
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(allTodos => {
        setTodos(allTodos);
        setFilteredTodos(allTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodo = (filter: string) => {
    switch (filter) {
      case (Filter.Active):
        setFilteredTodos(todos.filter(todo => !todo.completed));
        setIsSelected(Filter.Active);
        break;
      case (Filter.Completed):
        setFilteredTodos(todos.filter(todo => todo.completed));
        setIsSelected(Filter.Completed);
        break;
      default:
        setFilteredTodos(todos);
        setIsSelected(Filter.All);
    }
  };

  const addTodo = (newTodo: Todo) => {
    setTempTodo({ ...newTodo, id: 0 });
    setIsLoading(0);
    postService.createTodo(newTodo)
      .then((createdTodo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
        setFilteredTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToAdd))
      .finally(() => {
        setIsLoading(null);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(todoId);
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setFilteredTodos(prevTodos => prevTodos.filter(todo => (
          todo.id !== todoId)));
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToDelete))
      .finally(() => setIsLoading(null));
  };

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    filteredTodos,
    setFilteredTodos,
    errorMessage,
    setErrorMessage,
    isSelected,
    setIsSelected,
    isLoading,
    setIsLoading,
    deleteTodo,
    addTodo,
    filterTodo,
  }), [
    todos,
    tempTodo,
    filteredTodos,
    errorMessage,
    isSelected,
    isLoading,
    filterTodo]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
