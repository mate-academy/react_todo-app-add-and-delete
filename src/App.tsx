import React, { useCallback, useEffect, useState } from 'react';
import { USER_ID, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorText } from './types/ErrorText';
import { StatusFilter } from './types/StatusFilter';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorText, setErrorText] = useState<ErrorText>(ErrorText.NoError);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const preparedTodos = getFilteredTodos(todos, statusFilter);

  const handleStatusFilterClick = (statusFilterValue: StatusFilter) => {
    setStatusFilter(statusFilterValue);
  };

  const handleHideError = () => {
    setErrorText(ErrorText.NoError);
  };

  const handleError = useCallback((message: ErrorText) => {
    setErrorText(message);
    wait(3000).then(() => handleHideError());
  }, []);

  useEffect(() => {
    getTodos().then(
      data => {
        setTodos(data);
      },
      () => {
        handleError(ErrorText.Loading);
      },
    );
  }, [handleError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader />

        <TodoAppMain todos={preparedTodos} />

        {!!todos.length && (
          <TodoAppFooter
            onStatusFilterClick={handleStatusFilterClick}
            todos={todos}
            statusFilter={statusFilter}
          />
        )}
      </div>

      <ErrorNotification errorText={errorText} onHideError={handleHideError} />
    </div>
  );
};
