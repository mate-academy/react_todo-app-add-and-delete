/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const {
    todos,
    isLoading,
    isAdding,
    errorMessage,
    filter,
    newTitle,
    tempTodo,
    loadingTodoIds,
    newTodoInputRef,
    visibleTodos,
    setFilter,
    setNewTitle,
    closeError,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {isLoading && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        <Header
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          newTitle={newTitle}
          isAdding={isAdding}
          inputRef={newTodoInputRef}
          onNewTitleChange={setNewTitle}
          onSubmit={handleAddTodo}
        />

        {!isLoading && (todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            loadingTodoIds={loadingTodoIds}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={closeError} />
    </div>
  );
};
