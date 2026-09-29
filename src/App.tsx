/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useApp } from './hooks/UseApp';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodoForm } from './components/NewTodoForm'

export const App: React.FC = () => {
  const {
    visibleTodos,
    hasTodos,
    activeCount,
    hasCompleted,
    isAllCompleted,
    filter,
    setFilter,
    errorMessage,
    clearError,
    tempTodo,
    processingIds,
    addTodo,
    deleteTodo,
    clearCompleted,
    todosCount,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todosCount]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodoForm onSubmit={addTodo} inputRef={inputRef} />
        </header>

        {(hasTodos || tempTodo) && (
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              processingIds={processingIds}
              onDelete={deleteTodo}
            />
        )}

          {hasTodos && (
            <Footer
              activeCount={activeCount}
              hasCompleted={hasCompleted}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={clearCompleted}
            />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={clearError} />
    </div>
  );
};
