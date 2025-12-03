/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { FILTERS, FilterType } from './constants/filters';
import { useErrorNotification } from './hooks/useErrorNotification';
import { useTodos } from './hooks/useTodos';

import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { Loader } from './components/Loader';
import { ErrorNotification } from './components/ErrorNotification';

import {
  selectFilteredTodos,
  selectActiveCount,
  selectHasCompleted,
  selectAllCompleted,
} from './selectors/todoSelectors';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FILTERS.ALL);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    todos,
    tempTodo,
    processingIds,
    loading,
    isSubmitting,
    newTitle,
    setNewTitle,
    notification,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleClearCompleted,
  } = useTodos(USER_ID);

  const { error, isVisible, showError, hideError } = useErrorNotification();

  useEffect(() => {
    if (notification) {
      showError(notification);
    }
  }, [notification, showError]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [todos, tempTodo]);

  const filteredTodos = selectFilteredTodos(todos, filter);
  const activeTodosCount = selectActiveCount(todos);
  const hasCompletedTodos = selectHasCompleted(todos);
  const allCompleted = selectAllCompleted(todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allCompleted={allCompleted}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          isSubmitting={isSubmitting}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
        />

        <TodoMain
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {loading && <Loader />}

      <ErrorNotification error={error} hidden={!isVisible} onHide={hideError} />
    </div>
  );
};
