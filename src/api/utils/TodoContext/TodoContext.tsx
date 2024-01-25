import React, { useEffect, useState } from 'react';

import { UserWarning } from '../../../UserWarning';
import {
  createTodo, getTodos, updateTodoStatus, deleteTodo,
} from '../../todos';
import { Todo } from '../../types/Todo';

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12157;

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type ContextType = {
  todos: Todo[];
  setTodos: (todoArr: Todo[]) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isDisabled: boolean,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  filt: FilterStatus;
  setFilt: React.Dispatch<React.SetStateAction<FilterStatus>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>
  error: string | null;
  tempTodo: Todo | null;
  onSubmit: (title: string) => void;
  updateChecked: (todo: Todo) => void;
  handleError: (errorMessage: string) => void;
  filteredTodos: Todo[];
  TodoDeleteButton: (item: number) => void;
  clearCompleted: () => void;
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  setTodos: () => {},
  query: '',
  setQuery: () => {},
  isDisabled: false,
  setIsDisabled: () => {},
  filt: FilterStatus.All,
  setFilt: () => {},
  setError: () => {},
  error: '' || null,
  tempTodo: null,
  onSubmit: () => {},
  updateChecked: () => {},
  handleError: () => {},
  filteredTodos: [],
  TodoDeleteButton: () => {},
  clearCompleted: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filt, setFilt] = useState(FilterStatus.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  const onSubmit = (title: string) => {
    const temporaryTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsDisabled(true);

    createTodo(temporaryTodo)
      .then(newTodo => {
        setQuery('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const TodoDeleteButton = (idNumber: number) => {
    deleteTodo(idNumber)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== idNumber));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  };

  const clearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const updateChecked = (todo: Todo) => {
    updateTodoStatus(todo.id, todo.completed)
      .catch(() => {
        handleError('Unable to update a todo');
      });
  };

  const filteredTodos = todos.filter((todo: { completed: boolean; }) => {
    switch (filt) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      query,
      setQuery,
      isDisabled,
      setIsDisabled,
      filt,
      setFilt,
      setError,
      error,
      tempTodo,
      onSubmit,
      updateChecked,
      handleError,
      filteredTodos,
      TodoDeleteButton,
      clearCompleted,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
