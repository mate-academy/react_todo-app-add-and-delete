/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
// import { UserWarning } from './UserWarning';
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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingWhileDelete, setIsLoadingWhileDelete] =
    useState<boolean>(false);

  useEffect(() => {
    setHasError(false);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errorMessages.loadingError);
        setHasError(true);
      });
  }, []);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    const timer = setTimeout(() => {
      setHasError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasError]);

  const filteredTodos = useMemo(() => {
    return todoService.filter(todos, selectedFilter);
  }, [todos, selectedFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setIsLoading={setIsLoading}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
        />
        <TodoList
          setIsLoading={setIsLoading}
          setIsLoadingWhileDelete={setIsLoadingWhileDelete}
          isLoading={isLoading}
          isLoadingWhileDelete={isLoadingWhileDelete}
          todos={filteredTodos}
          setTodos={setTodos}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        )}
      </div>
      <Error hasError={hasError} errorMessage={errorMessage} />
    </div>
  );
};
