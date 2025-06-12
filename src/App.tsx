import cn from 'classnames';
import React, { useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { useTodos } from './hooks/useTodos';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/TodoErrorNotification';
import { USER_ID } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { TodoFooterNav } from './components/TodoFooterNav';
import { TodoFooterButton } from './components/TodoFooterButton';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    initialLoading,
    onAddTodo,
    tempTodo,
    onDeleteTodo,
    deletingTodoId,
    onDeleteAllCompleted,
    isMassDeleting,
  } = useTodos();
  const { visibleTodos, filter, setFilter } = useFilteredTodos(todos);

  const allTodosCompleted = useMemo(() => {
    return todos.length && todos.every(todo => todo.completed);
  }, [todos]);

  const anyCompletedTodo = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const itemsLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const isAddingTodo = tempTodo !== null;
  const resetError = () => setErrorMessage('');

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
            className={cn('todoapp__toggle-all', {
              active: allTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <TodoForm onSubmit={onAddTodo} disabled={isAddingTodo} />
        </header>

        {!initialLoading && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            isLoadingTemp={isAddingTodo}
            onDeleteTodo={onDeleteTodo}
            deletingId={deletingTodoId}
            isMassDeleting={isMassDeleting}
          />
        )}

        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            <TodoFooterNav filter={filter} setFilter={setFilter} />

            <TodoFooterButton
              anyCompleted={anyCompletedTodo}
              onDeleteAllCompleted={onDeleteAllCompleted}
            />
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={resetError}
        setError={setErrorMessage}
      />
    </div>
  );
};
