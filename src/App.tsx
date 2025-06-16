/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorMessages } from './components/Error.Messages/ErrorMessages';
import React from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    handleHideError,
    visibleFooter,
    filteredTodos,
    activeTodos,
    handleTodoDelete,
    handleDeleteAllCompletedTodos,
    allTodosCompleted,
    isCompletedTodos,
    handleTodoAdd,
    tempTodo,
    setTempTodo,
    inputFocus,
    todoInOperation,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={allTodosCompleted}
          handleTodoAdd={handleTodoAdd}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          inputFocus={inputFocus}
        />

        <TodoList
          filteredTodos={filteredTodos}
          handleTodoDelete={handleTodoDelete}
          tempTodo={tempTodo}
          todoInOperation={todoInOperation}
        />
        {visibleFooter && (
          <Footer
            activeTodos={activeTodos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isCompletedTodos={isCompletedTodos}
            handleDeleteAllCompletedTodos={handleDeleteAllCompletedTodos}
          />
        )}
      </div>
      <ErrorMessages
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
