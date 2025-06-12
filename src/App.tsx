/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { TodoComponent } from './components/TodoComponent';
import { Header } from './components/Header';
import { useTodo } from './utils/hooks/useTodo';

export const App: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
    isLoading,
    todos,
    filteredTodos,
    filterOption,
    setFilterOption,
    handleCreateTodo,
    handleDeleteTodo,
    isTodoLoading,
    tempTodo,
    deletingTodoId,
    handleClearCompletedTodos,
    focusInput,
    setFocusInput
  } = useTodo();
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isLoading={isLoading}
          isTodoLoading={isTodoLoading}
          handleCreateTodo={handleCreateTodo}
          todoDeleted={focusInput}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {!isLoading &&
            filteredTodos.map(todo => (
              <TodoComponent
                key={todo.id}
                todo={todo}
                isLoading={isLoading}
                handleDeleteTodo={handleDeleteTodo}
                isTodoLoading={isTodoLoading}
                deletingTodoId={deletingTodoId}
              />
            ))}
        </section>
        {isTodoLoading && (
          <TodoComponent
            todo={tempTodo || null}
            isLoading={isLoading}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            handleClearCompletedTodos={handleClearCompletedTodos}
            setFocusInput={setFocusInput}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
