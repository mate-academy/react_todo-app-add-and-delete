/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Form } from './components/Form';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { getTodos } from './api/todos';
import { Errors } from './types/Errors';

const USER_ID = 12132;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredByStatus, setFiltredByStatus] = useState<Status>(Status.ALL);
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showErrorNotification = (message: string) => {
    setErrorNotification(message);

    setTimeout(() => {
      setErrorNotification(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        showErrorNotification(Errors.UNABLE);
      });
  }, []);

  const addNewTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const togleCheck = (id: number) => {
    setTodos(prevState => prevState.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    }));
  };

  const toDelete = (id: number) => {
    setTodos(prevState => prevState.filter((todo) => todo.id !== id));
  };

  const filtredTodo = todos.filter((todo) => {
    switch (filtredByStatus) {
      case Status.ACTIVE:
        return !todo.completed;
      case Status.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

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
          <Form
            USER_ID={USER_ID}
            addNewTodo={addNewTodo}
            showErrorNotification={showErrorNotification}
            setTempTodo={setTempTodo}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              toDelete={toDelete}
              todos={filtredTodo}
              togleCheck={togleCheck}
              showErrorNotification={showErrorNotification}
              tempTodo={tempTodo}
            />

            <Footer
              setTodos={setTodos}
              todos={todos}
              setFiltredByStatus={setFiltredByStatus}
              filtredByStatus={filtredByStatus}
              showErrorNotification={showErrorNotification}
            />
          </>
        )}
      </div>
      {errorNotification && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorNotification(null)}
          />
          {errorNotification}
        </div>
      )}
    </div>
  );
};
