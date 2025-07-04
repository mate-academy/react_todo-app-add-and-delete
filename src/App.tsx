/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodosManager } from './hooks/useTodosManager';
import { TodosFilter } from './components/Footer/TodosFilter';
import { TodosCounter } from './components/Footer/TodosCounter';
import { ClearCompletedButton } from './components/Footer/ClearCompletedButton';
import { TodoList } from './components/TodoList/TodoList';
import { NewTodoForm } from './components/header/NewTodoForm';
import { Button } from './components/header/ToggleAllButton';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    todosCounter,
    preparedTodos,
    handleAddTodo,
    handlDeleteTodo,
    handleClearCompleted,
    tempTodo,
    inputRef,
    setShouldFocus,
    loadingId,
    isDisabled,
    allCompleted,
    loading,
  } = useTodosManager();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <Button allCompleted={allCompleted} />

          <NewTodoForm
            onAddTodo={handleAddTodo}
            inputRef={inputRef}
            loading={loading}
          />
        </header>

        <TodoList
          todos={preparedTodos}
          loadingIds={loadingId}
          onDelete={handlDeleteTodo}
          tempTodo={tempTodo}
        />
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodosCounter count={todosCounter} />

            <TodosFilter filter={filter} setFilter={setFilter} />

            <ClearCompletedButton
              onClearCompleted={handleClearCompleted}
              isDisabled={isDisabled}
            />
          </footer>
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => {
          setErrorMessage('');
          setShouldFocus(true);
        }}
      />
    </div>
  );
};
