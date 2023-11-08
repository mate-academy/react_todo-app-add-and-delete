/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Form } from './components/Form';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { getTodos } from './api/todos';

const USER_ID = 11851;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredByStatus, setFiltredByStatus] = useState<Status>(Status.all);
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );
  const [errorVisible, setErrorVisible] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showErrorNotification = (message: string) => {
    setErrorNotification(message);
    setErrorVisible(true);

    setTimeout(() => {
      setErrorVisible(false);
      setErrorNotification(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        // Обработка ошибки при загрузке данных
        // console.error('Unable to load todos:', error);
        showErrorNotification('Unable to load todos');
      });
  }, []);

  const addNewTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const togleCheck = (id: number) => {
    const togledTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(togledTodos);
  };

  const toDelete = (id: number) => {
    const afterDeleteTodo = todos.filter((todo) => todo.id !== id);

    setTodos(afterDeleteTodo);
  };

  const filtredTodo = todos.filter((todo) => {
    switch (filtredByStatus) {
      case Status.active:
        return !todo.completed;
      case Status.completed:
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
          {/* this buttons is active only if there are some active todos */}

          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          {/* Add a todo on form submit */}
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
            {/* Hide the footer if there are no todos */}
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

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorVisible ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorVisible(false)}
        />
        {/* show only one message at a time */}
        {errorNotification}
      </div>
    </div>
  );
};
