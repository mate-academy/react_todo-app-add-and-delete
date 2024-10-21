/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { UserWarning } from './UserWarning';
import { TodoForm, TodoList, TodoInfo, Footer, Error } from './components';
import { areAllActive, areAllCompleted, countActiveTodos } from './utils';
import { useTodos } from './hooks/useTodos';
import { USER_ID } from './constants';
import { ErrorType } from './types';

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    handleAddError,
    addTodo,
    deleteTodo,
    deleteCompletedTodo,
    filteredTodos,
    filter,
    setFilter,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          onSubmit={addTodo}
          onSetError={handleAddError}
          areAllCompleted={areAllCompleted(todos)}
          isLoading={!!loadingTodoIds.length}
          todos={todos}
          errorMessage={errorMessage}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              loadingTodoIds={loadingTodoIds}
              onDelete={deleteTodo}
            />
            {tempTodo && (
              <TodoInfo todo={tempTodo} loadingTodoIds={loadingTodoIds} />
            )}

            <Footer
              onAddFilter={setFilter}
              filter={filter}
              activeTodos={countActiveTodos(todos)}
              areAllActive={areAllActive(todos)}
              onDeleteCompletedTodos={deleteCompletedTodo}
            />
          </>
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onResetError={() => setErrorMessage(ErrorType.None)}
      />
    </div>
  );
};
