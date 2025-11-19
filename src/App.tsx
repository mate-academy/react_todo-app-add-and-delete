/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoStatus } from './types/TodoStatus';
import { getFilteredTodos } from './helpers/getFilteredTodos';
import { TodoForm } from './components/TodoForm';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    error,
    setError,
    tempItem,
    getTodos,
    addTodo,
    modifyIds,
    removeTodo,
    clearCompletedTodos,
    isCreating,
    isOperationEnd,
  } = useTodos();
  const [filter, setFilter] = useState<TodoStatus>('All');

  const timerId = useRef(0);

  const preparedTodos = useMemo(
    () => getFilteredTodos(todos, { status: filter }),
    [todos, filter],
  );

  const isAllTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  useEffect(() => {
    if (error) {
      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      window.clearTimeout(timerId.current);
    };
  }, [error, setError]);

  const handleCloseError = useCallback(() => {
    setError('');
  }, [setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <TodoForm
            onSubmit={addTodo}
            onError={setError}
            isSubmiting={isCreating}
            isFocus={isOperationEnd}
          />
        </header>
        <TodoList
          todos={preparedTodos}
          tempTodo={tempItem}
          modifyIds={modifyIds}
          onRemoveTodo={removeTodo}
        />

        {todos.length !== 0 && (
          <Footer
            filterQuery={filter}
            onChangeFilterQuery={setFilter}
            todos={todos}
            onClear={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={handleCloseError} />
    </div>
  );
};
