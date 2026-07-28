import React from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNot/ErrorNot';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    visibleTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    title,
    setTitle,
    activeTodosCount,
    isEveryCompleted,
    isSubmitting,
    tempTodo,
    loadingTodoIds,
    inputRef,
    handleAddTodo,
    onDelete,
    clearCompleted,
    toggleTodo,
    completedTodosCount
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isEveryCompleted={isEveryCompleted}
          title={title}
          setTitle={setTitle}
          isSubmitting={isSubmitting}
          onSubmit={handleAddTodo}
          inputRef={inputRef}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={onDelete}
            toggleTodo={toggleTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
