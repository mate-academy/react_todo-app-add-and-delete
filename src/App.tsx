import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { handleDeleteTodo } from './utils/handleDeleteTodo';
import { getFilteredTodos } from './utils/getFilteredTodo';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { fetchTodos } from './utils/fetchTodos';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [filter, setFilter] = useState(FilterType.all);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.DEFAULT,
  );

  const handleFilterChange = useCallback(
    (filterBy: FilterType) => {
      setFilter(filterBy);
    },
    [setFilter],
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [todos, filter],
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemoveError = useCallback(() => {
    setErrorMessage(ErrorType.DEFAULT);
  }, []);

  const handleErrorMessage = useCallback(
    (error: ErrorType) => {
      setErrorMessage(error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handleRemoveError();
        timeoutRef.current = null;
      }, 3000);
    },
    [handleRemoveError],
  );

  const handleTempTodo = useCallback(
    (todo: Todo | null) => {
      setTempTodo(todo);
    },
    [setTempTodo],
  );

  useEffect(() => {
    handleDeleteTodo(
      deletingTodoIds,
      setTodos,
      setDeletingTodoIds,
      handleErrorMessage,
    );
  }, [deletingTodoIds, handleErrorMessage]);

  useEffect(() => {
    fetchTodos(setTodos, handleErrorMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          onError={handleErrorMessage}
          setTempTodo={handleTempTodo}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={filteredTodos}
          deletingTodoIds={deletingTodoIds}
          setDeletingTodoIds={setDeletingTodoIds}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            setDeletingTodoIds={setDeletingTodoIds}
          />
        )}

        {!!todos.length && (
          <Footer
            filterBy={filter}
            setFilter={handleFilterChange}
            todos={todos}
            setDeletingTodoIds={setDeletingTodoIds}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        handleRemoveError={handleRemoveError}
      />
    </div>
  );
};
