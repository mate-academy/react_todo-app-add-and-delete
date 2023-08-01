/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { Status } from './types/Status';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/Error';
import { Error } from './types/Error';

const USER_ID = 11126;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const count = useMemo(() => todos?.reduce(
    (total, todo) => (todo.completed ? total : total + 1),
    0,
  ), [todos]);

  const showErrorNotification = (notification: string): void => {
    setErrorNotification(notification);

    setInterval(() => {
      setErrorNotification('');
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showErrorNotification(Error.Load))
      .finally(() => setLoading(false));
  }, []);

  const createTodo = (createdTodo: Todo) => {
    setLoading(true);
    setTempTodo(createdTodo);

    addTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos!, newTodo]);
      })
      .catch(() => {
        setErrorNotification(Error.Add);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodos = (todoId: number) => {
    setRemovingId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos:Todo[] | null) => {
          if (!currentTodos) {
            return null;
          }

          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorNotification(Error.Delete);
      })
      .finally(() => {
        setRemovingId(null);
      });
  };

  const deleteCompletedTodo = () => {
    setLoading(true);

    const completedTodos = todos?.filter(todo => todo.completed);

    if (!completedTodos || completedTodos.length === 0) {
      setErrorNotification('No completed todos to delete');
      setLoading(false);
    }
  };

  function getPreperadTodos() {
    const visibleTodos = [...todos!];

    switch (status) {
      case Status.All:
        return visibleTodos;

      case Status.Completed:
        return visibleTodos.filter(todo => todo.completed);

      case Status.Active:
        return visibleTodos.filter(todo => !todo.completed);

      default:
        return visibleTodos;
    }
  }

  const visibleTodos = useMemo(() => getPreperadTodos(), [todos,
    status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos?.length !== 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className="todoapp__toggle-all active"
            />
          )}
          <TodoForm
            loading={loading}
            createTodo={createTodo}
            userId={USER_ID}
            setNotification={setErrorNotification}
            tempTodo={tempTodo}
          />
        </header>
        {hasTodos && (
          <section className="todoapp__main">
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodos={deleteTodos}
              removingId={removingId}
            />
          </section>
        )}
        {hasTodos && (
          <Footer
            todos={visibleTodos}
            count={count}
            status={status}
            setStatus={setStatus}
            removeCompleted={deleteCompletedTodo}
          />
        )}
      </div>
      <ErrorNotification
        notification={errorNotification}
        setNotification={setErrorNotification}
      />
    </div>
  );
};
