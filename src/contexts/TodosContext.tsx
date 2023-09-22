import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/TodoStatus';
import { filterBy } from '../utils/filterBy';
import {
  INVALID_TITLE_ERROR_MESSAGE,
  UNABLE_ADD_ERROR_MESSAGE,
  UNABLE_DELETE_ERROR_MESSAGE, UNABLE_DOWNLOAD_ERROR_MESSAGE,
  USER_ID,
} from '../utils/constants';
import { addTodo, deleteTodo, getTodos } from '../api/todos';
import { ErrorWithKey } from '../types/ErrorWithKey';

interface TodosContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;

  filterType: FilterType;
  setFilterType: (filterType: FilterType) => void;

  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;

  todosIdsUpdating: number[];
  setTodosIdsUpdating: (ids: number[]) => void;

  errorMessage: { key: number, message: string } | null;
  setErrorMessage: (error: ErrorWithKey) => void;

  visibleTodos: Todo[];

  handleFilterChange: (type: FilterType) => void;
  handleAddTodo: (
    title: string
  ) => Promise<boolean>;
  handleDeleteTodo: (...ids: number[]) => void;
}

const initialTodosState: TodosContextType = {
  todos: [],
  setTodos: () => {},
  filterType: FilterType.All,
  setFilterType: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosIdsUpdating: [],
  setTodosIdsUpdating: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  visibleTodos: [],
  handleFilterChange: () => {},
  handleAddTodo: () => Promise.resolve(false),
  handleDeleteTodo: () => {},
};

export const TodosContext = createContext<TodosContextType>(initialTodosState);

interface Props {
  children: React.ReactNode
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosIdsUpdating, setTodosIdsUpdating] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorWithKey | null>(null);

  const setErrorMessageWithKey = (message: string) => {
    setErrorMessage({ key: Date.now(), message });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessageWithKey(UNABLE_DOWNLOAD_ERROR_MESSAGE));
  }, []);

  const visibleTodos = useMemo(() => {
    return filterBy(todos, filterType);
  }, [filterType, todos]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  const handleAddTodo = async (
    title: string,
  ): Promise<boolean> => {
    setErrorMessage(null)
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessageWithKey(INVALID_TITLE_ERROR_MESSAGE);

      return false;
    }

    const tempTodoData = {
      title: normalizedTitle, userId: USER_ID, completed: false, id: 0,
    };
    const addTodoPromise = addTodo(tempTodoData);

    try {
      setTempTodo(tempTodoData);
      setTodosIdsUpdating([tempTodoData.id]);

      const response = await addTodoPromise;
      const updatedTodo = { ...tempTodoData, id: response.id };

      setTodos(prevTodos => [...prevTodos, updatedTodo]);

      return true;
    } catch {
      setErrorMessageWithKey(UNABLE_ADD_ERROR_MESSAGE);

      return false;
    } finally {
      setTempTodo(null);
      setTodosIdsUpdating([]);
    }
  };

  const handleDeleteTodo = async (...ids: number[]) => {
    setErrorMessage(null)
    setTodosIdsUpdating(ids);
    const deletePromises = ids.map(async (id) => {
      try {
        await deleteTodo(id);

        return id;
      } catch {
        return null;
      }
    });

    const deletedIds = await Promise.all(deletePromises);

    setTodos(
      prevState => prevState.filter(todo => !deletedIds.includes(todo.id)),
    );

    setTodosIdsUpdating([]);

    if (deletedIds.includes(null)) {
      setErrorMessageWithKey(UNABLE_DELETE_ERROR_MESSAGE);
    }
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filterType,
        setFilterType,
        tempTodo,
        setTempTodo,
        todosIdsUpdating,
        setTodosIdsUpdating,
        errorMessage,
        setErrorMessage,
        visibleTodos,
        handleFilterChange,
        handleAddTodo,
        handleDeleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
