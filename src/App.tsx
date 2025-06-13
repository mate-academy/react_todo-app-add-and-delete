/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { ErrorComponent } from './components/ErrorComponent';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTodoController } from './hooks/useTodoController';

export const App: React.FC = () => {
  const {
    todos,
    isTodosLoading,
    errorMessage,
    setErrorMessage,
    tempTodo,
    onAddTodo,
    isAddTodoFormFocused,
    setIsAddTodoFormFocused,
    onTodoDelete,
    onClearCompletedTodos,
    todoToDeleteIds,
    statusFilter,
    setStatusFilter,
    filteredTodos,
    activeItemsCount,
    isThereAtLeastOneCompletedTodo,
  } = useTodoController();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          onAddTodo={onAddTodo}
          isAddTodoFormFocused={isAddTodoFormFocused}
          setIsAddTodoFormFocused={setIsAddTodoFormFocused}
        />

        {!isTodosLoading && Boolean(todos.length) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onTodoDelete={onTodoDelete}
              todoToDeleteIds={todoToDeleteIds}
            />

            <Footer
              activeTodosCount={activeItemsCount}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              isThereAtLeastOneCompletedTodo={isThereAtLeastOneCompletedTodo}
              onClearCompletedTodos={onClearCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorComponent
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
