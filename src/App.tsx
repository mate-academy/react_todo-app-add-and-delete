import React from 'react';
import { UserWarning } from './UserWarning';
import * as todosApi from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    isAdding,
    deletingTodo,
    todoInput,
    activeTodosCount,
    hasCompletedTodos,
    isEveryTodoCompleted,
    filteredTodos,
    handleAddTodo,
    handleTodoStatusChange,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
  } = useTodos();

  if (!todosApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoInputRef={todoInput}
          isEveryTodoCompleted={isEveryTodoCompleted}
          onAdd={handleAddTodo}
          onToggleAll={handleToggleAll}
          disabled={isAdding}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          onStatusChange={handleTodoStatusChange}
          tempTodo={tempTodo}
          deletingTodo={deletingTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
