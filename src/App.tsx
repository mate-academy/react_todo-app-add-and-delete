import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import * as todoService from './utils/helpers';
import { Error } from './components/Errors';
import { errorMessages } from './utils/const';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<todoService.Status>(
    todoService.Status.all,
  );
  const [error, setError] = useState({ hasError: false, message: '' });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasVisible, setHasVisible] = useState<boolean>(false);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setHasVisible(true);
      })
      .catch(() =>
        setError({ hasError: true, message: errorMessages.loadingError }),
      );
  }, []);

  useEffect(() => {
    if (!error.hasError) {
      return;
    }

    const timer = setTimeout(
      () => setError({ hasError: false, message: '' }),
      3000,
    );

    return () => clearTimeout(timer);
  }, [error.hasError]);

  const filteredTodos = useMemo(() => {
    return todoService.filter(todos, selectedFilter);
  }, [todos, selectedFilter]);

  const setTodosCallback = useCallback(
    (update: React.SetStateAction<Todo[]>) => {
      setTodos(update);
    },
    [],
  );

  const appProps = {
    todos,
    setTodos: setTodosCallback,
    error,
    setError,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    selectedFilter,
    setSelectedFilter,
    filteredTodos,
    hasVisible,
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header {...appProps} />
        <TodoList {...appProps} />
        {todos.length > 0 && <Footer {...appProps} />}
      </div>
      <Error hasError={error.hasError} errorMessage={error.message} />
    </div>
  );
};
