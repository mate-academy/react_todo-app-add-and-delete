import React, { useContext, useEffect, useState } from 'react';
import * as postService from './api/todos';

import { Status } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './services/getFilteredTodos';

interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: Status;
  setFilterStatus: (filterStatus: Status) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: ErrorMessages | string) => void;
  filteredTodos: Todo[];
  isSubmitting: boolean;
  clearError: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChangeStatus: (todoId: number) => void;
}

const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todoTitle: '',
  setTodoTitle: () => {},
  filterStatus: Status.All,
  setFilterStatus: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  filteredTodos: [],
  isSubmitting: false,
  clearError: () => {},
  handleChange: () => {},
  handleSubmit: () => {},
  handleChangeStatus: () => {},
});

export const useTodos = () => useContext(TodosContext);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  function clearError() {
    wait(3000).then(() => setErrorMessage(''));
  }

  function addTodo({
    title,
    completed,
    userId,
  }: {
    title: string;
    completed: boolean;
    userId: number;
  }) {
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    postService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToAddaTodo);
        clearError();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage(ErrorMessages.TitleShouldNotBeEmpty);
      clearError();

      return;
    }

    addTodo({
      title: todoTitle.trim(),
      completed: false,
      userId: postService.USER_ID,
    });

    setTodoTitle('');
  };

  const handleChangeStatus = (todoId: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);

    const todoToUpdate = updatedTodos.find(todo => todo.id === todoId);

    if (todoToUpdate) {
      postService
        .updateTodo(todoToUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UnableToUpdateaTodo);
          clearError();
        });
    }
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToLoadTodos);
        clearError();
      });
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
        todoTitle,
        setTodoTitle,
        filterStatus,
        setFilterStatus,
        errorMessage,
        setErrorMessage,
        filteredTodos,
        isSubmitting,
        clearError,
        handleChange,
        handleSubmit,
        handleChangeStatus,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
