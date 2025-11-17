/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import classNames from 'classnames';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    filter,
    error,
    tempTodo,
    isAdding,
    deletingIds,
    focusTrigger,
    isAllCompleted,
    visibleTodos,
    handleFilterClick,
    handleAdd,
    handleDelete,
    handleClearCompleted,
    handleToggle,
    hideError,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAllCompleted={isAllCompleted}
          onAdd={handleAdd}
          isAdding={isAdding}
          focusTrigger={focusTrigger}
        />

        {visibleTodos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDelete={handleDelete}
            onToggle={handleToggle}
            isLoading={deletingIds.includes(todo.id)}
          />
        ))}

        {tempTodo && <TodoItem todo={tempTodo} key={0} isTemp isLoading />}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            handleFilterClick={handleFilterClick}
            onClearCompleted={handleClearCompleted}
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
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
