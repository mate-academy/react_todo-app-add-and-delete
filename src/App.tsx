/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './Components/UserWarning/UserWarning';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorMessage } from './Components/ErrorMessage';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Errors } from './types/Errors';
import { Status } from './types/Status';
import { Header } from './Components/Header';
import { USER_ID } from './utils/userId';
import { TodoItem } from './Components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editedTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Errors | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletionId, setDeletionId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.LoadError));
  }, []);

  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filterStatus) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      default:
        return true;
    }
  }), [filterStatus, todos]);

  return USER_ID ? (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              edited={editedTodo}
              setTodos={setTodos}
              setError={setError}
              deletionId={deletionId}
              setDeletionId={setDeletionId}
            />

            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                edited={editedTodo}
                isTemp
                todos={todos}
                setError={setError}
              />
            )}

            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              setError={setError}
              todos={todos}
              setTodos={setTodos}
              setDeletionId={setDeletionId}
            />
          </>
        )}
      </div>

      {error
        && (
          <ErrorMessage
            error={error}
            setError={setError}
          />
        )}
    </div>
  ) : <UserWarning />;
};
