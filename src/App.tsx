/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const areTodosExist = todos.length !== 0;
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setIsErrorHidden(false);
        alert(error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {areTodosExist && <TodoList todos={filteredTodos} />}
        {/* Hide the footer if there are no todos */}
        {areTodosExist && (
          <Footer
            notCompletedTodos={notCompletedTodos}
            onFilterChange={setFilter}
            currentFilter={filter}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: isErrorHidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsErrorHidden(true)}
        />
        {/* show only one message at a time */}
        Unable to load todos
      </div>
    </div>
  );
};
