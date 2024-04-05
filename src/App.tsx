import React, { useContext, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { ErrorMessages, StatusFilterValue } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { TodoContext } from './TodoContext/TodoContext';
import { getPreparedTodos } from './utils/helpers';
import { NewTodo } from './components/NewTodo/NewTodo';

export const App: React.FC = () => {
  const { error, setError, displayError, todos, setTodos } =
    useContext(TodoContext);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    StatusFilterValue.All,
  );

  const preparedTodos = getPreparedTodos(todos, statusFilter);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        displayError(ErrorMessages.TodosLoad);
      });
  }, [displayError, setError, setTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          <NewTodo
            onTodoCreated={newTodo => {
              setTodos(currentTodos => [...currentTodos, newTodo]);
            }}
          />
        </header>
        {preparedTodos.length > 0 && <TodoList todos={preparedTodos} />}
        {todos.length > 0 && (
          <Footer
            setStatusFilter={setStatusFilter}
            todos={todos}
            statusFilter={statusFilter}
          />
        )}
      </div>
      <ErrorMessage message={error} setError={setError} />
    </div>
  );
};
