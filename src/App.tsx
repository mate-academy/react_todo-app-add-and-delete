import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { ErrorMessages, StatusFilterValue } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { getPreparedTodos } from './utils/helpers';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { useTodos } from './utils/hooks';

export const App: React.FC = () => {
  const { error, setError, displayError, todos, setTodos } = useTodos();
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
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          <NewTodoForm
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
