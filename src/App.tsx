/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtrationParam, setFiltrationParam] = useState(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage != '') {
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [errorMessage]);

  const filterTodos = (todosFromServer: Todo[], param: TodoStatus) => {
    return todosFromServer.filter(todo => {
      if (param === TodoStatus.active) {
        return !todo.completed;
      }

      if (param === TodoStatus.completed) {
        return todo.completed;
      }

      return true;
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length && (
          <TodoList todos={filterTodos(todos, filtrationParam)} />
        )}
        {!!todos.length && (
          <Footer
            activeTodosCount={filterTodos(todos, TodoStatus.active).length}
            selectedParam={filtrationParam}
            onSelectParam={setFiltrationParam}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
