/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.all);
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    if (status === Status.all) {
      return todos;
    }

    return todos.filter(todo => {
      return status === Status.completed ? todo.completed : !todo.completed;
    });
  }, [todos, status]);

  const handleCompletedStatus = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />

        <TodoList
          todos={filteredTodos}
          isEditingTodo={isEditingTodo}
          setIsEditingTodo={setIsEditingTodo}
          handleCompletedStatus={handleCompletedStatus}
        />

        {!!todos.length && (
          <TodoFilter setStatus={setStatus} status={status} todos={todos} />
        )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}

        {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
