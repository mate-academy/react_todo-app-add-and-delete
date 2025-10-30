/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import Header from './components/Header';
import useTodos from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    query,
    status,
    tempTodo,
    todosLeft,
    addInputRef,
    errorMessage,
    filteredTodos,
    hideError,
    handleSubmit,
    handleDelete,
    getIsTodoLoading,
    handleQueryChange,
    handleStatusChange,
    handleDeleteAllCompleted,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          tempTodo={tempTodo}
          addInputRef={addInputRef}
          onQueryChange={handleQueryChange}
          onSubmit={handleSubmit}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={getIsTodoLoading}
          onDelete={handleDelete}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            todosLeft={todosLeft}
            onDeleteAll={handleDeleteAllCompleted}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMessage} onHideError={hideError} />
    </div>
  );
};
