import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Loader } from './components/Loader';

export const ERROR_MESSAGES = {
  failedLoadingTodos: 'Unable to load todos',
  failedAddingTodo: 'Unable to add a todo',
  failedDeletingTodo: 'Unable to delete a todo',
  failedUpdatingTodo: 'Unable to update a todo',
  emptyTitle: 'Title should not be empty',
};

export type Filter = 'all' | 'active' | 'completed';

const isFilter = (value: string): value is Filter => {
  return ['all', 'active', 'completed'].includes(value);
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [appliedFilter, setAppliedFilter] = useState<Filter>('all');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isClearingCompletedTodos, setIsClearingCompletedTodos] =
    useState(false);

  const notCompletedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const addTodo = useCallback((todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  }, []);

  const removeTodo = (todoId: number) => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => todo.id !== todoId);
    });
  };

  const clearCompletedTodos = () => {
    setIsClearingCompletedTodos(true);
    const promises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(promises).then(results => {
      const failedIds = completedTodos
        .filter((_, i) => results[i].status === 'rejected')
        .map(todo => todo.id);

      if (failedIds.length > 0) {
        setErrorMessage(ERROR_MESSAGES.failedDeletingTodo);
      }

      setTodos(prev =>
        prev.filter(todo => !todo.completed || failedIds.includes(todo.id)),
      );
    });
  };

  const processTodoData = useCallback((promise: Promise<Todo[]>) => {
    promise
      .then(res => {
        setTodos(res);
        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage(ERROR_MESSAGES.failedLoadingTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);
    let filterParam = new URL(window.location.href).hash.slice(2);

    if (filterParam === '') {
      filterParam = 'all';
    }

    if (filterParam && isFilter(filterParam)) {
      setAppliedFilter(filterParam as Filter);
    }

    setErrorMessage('');
    processTodoData(getTodos());
  }, [processTodoData]);

  const visibleTodos = useMemo(() => {
    switch (appliedFilter) {
      case 'active':
        return notCompletedTodos;
      case 'completed':
        return completedTodos;
      case 'all':
        return todos;
    }
  }, [todos, appliedFilter, notCompletedTodos, completedTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          addTodo={addTodo}
          appliedFilter={appliedFilter}
          todos={todos}
        />

        {isLoading && <Loader />}

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          className="todoapp__main"
          deleteTodo={removeTodo}
          setErrorMessage={setErrorMessage}
          completedTodos={completedTodos}
          isClearingCompletedTodos={isClearingCompletedTodos}
        />

        {todos.length !== 0 && (
          <Footer
            clearCompletedTodos={clearCompletedTodos}
            notCompletedTodos={notCompletedTodos}
            completedTodos={completedTodos}
            appliedFilter={appliedFilter}
            handleFilterChange={setAppliedFilter}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} hidden={!errorMessage} />
    </div>
  );
};
