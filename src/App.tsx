import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useTodosManager } from './hooks/useTodosManager';

import { NewTodoForm, ToggleAllButton } from './components/Header';
import {
  ClearCompletedButton,
  TodosCounter,
  TodosFilter,
} from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    todos,
    loading,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    isAdding,
    loadingIds,
    inputRef,
    setShouldFocus,
    allCompleted,
    isDisabled,
    filteredTodos,
    todosCounter,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
  } = useTodosManager();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAllButton
            allCompleted={allCompleted}
            onToggleAll={handleToggleAll}
            isDisabled={loading}
          />

          <NewTodoForm
            onAddTodo={handleAddTodo}
            isAdding={isAdding || loading}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodosCounter count={todosCounter} />

            <TodosFilter filter={filter} onFilterChange={setFilter} />

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
