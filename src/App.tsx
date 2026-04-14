import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Loader } from './components/Loader';

const ERROR_MESSAGES = {
  failedLoadingTodos: 'Unable to load todos',
  failedAddingTodo: 'Unable to add a todo',
  failedDeletingTodo: 'Unable to delete a todo',
  failedUpdatingTodo: 'Unable to update a todo',
  emptyTitle: 'Title should not be empty',
};

export type Filter = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [appliedFilter, setAppliedFilter] = useState<Filter>('All');

  const setFilter = useCallback((filter: Filter) => {
    setAppliedFilter(filter);
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.failedLoadingTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos: Todo[];

    switch (appliedFilter) {
      case 'Active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'Completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        filteredTodos = todos;
    }

    return filteredTodos;
  }, [todos, appliedFilter]);

  const notCompletedTodosLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {isLoading && <Loader />}

        <TodoList todos={visibleTodos} className="todoapp__main" />

        {todos.length !== 0 && (
          <Footer
            notCompletedTodosLength={notCompletedTodosLength}
            appliedFilter={appliedFilter}
            onFilterChange={setFilter}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} hidden={!errorMessage} />
    </div>
  );
};
