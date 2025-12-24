import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import {
  isTodoStatusOption,
  TodoStatusOption,
  TodoStatusOptions,
} from './types/TodoStatusOption';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { NewTodoForm } from './components/NewTodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatusOption>(TodoStatusOptions.ALL);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addLoadingId = (postId: number) => {
    setLoadingIds(prev => (prev.includes(postId) ? prev : [...prev, postId]));
  };

  const removeLoadingId = (postId: number) => {
    setLoadingIds(prev => prev.filter(lid => lid !== postId));
  };

  const setDisappearingError = (msg: string, timeout: number = 3000) => {
    setError(msg);
    setTimeout(() => setError(''), timeout);
  };

  const getWindowHash = (): TodoStatusOption => {
    const hash = window.location.hash.slice(2);

    return isTodoStatusOption(hash)
      ? (hash as TodoStatusOption)
      : TodoStatusOptions.ALL;
  };

  useEffect(() => {
    const handleHashChange = () => setFilter(getWindowHash());

    window.addEventListener('hashchange', handleHashChange);
    setFilter(getWindowHash());

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    setError('');
    getTodos()
      .then((fetchedTodos: Todo[]) => setTodos(fetchedTodos))
      .catch(() => {
        setDisappearingError('Unable to load todos');
      });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case TodoStatusOptions.ACTIVE:
        return todos.filter(t => !t.completed);
      case TodoStatusOptions.COMPLETED:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const toggleButtonActive = useMemo(() => {
    return todos.length === todos.filter(t => t.completed).length;
  }, [todos]);
  const renderTodosList = !!todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {renderTodosList && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: toggleButtonActive,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodoForm
            setTodos={setTodos}
            setError={setError}
            setDisappearingError={setDisappearingError}
            setTempTodo={setTempTodo}
            todos={todos}
          />
        </header>

        <TodoList
          visibleTodos={visibleTodos}
          setTodos={setTodos}
          setError={setError}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          addLoadingId={addLoadingId}
          removeLoadingId={removeLoadingId}
        />

        {!!todos.length && (
          <Footer
            allTodos={todos}
            setTodos={setTodos}
            currentFilter={filter}
            setError={setError}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
