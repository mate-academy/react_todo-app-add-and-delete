/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';

import { filterTodos } from './utils/filterTodos';
import { deleteTodo, getTodos } from './api/todos';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 6864;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState(Error.None);
  const [containsCompleted, setContainsCompleted] = useState(true);

  const handleError = (err: Error) => {
    if (err !== Error.None) {
      setTimeout(() => setErrorType(Error.None), 3000);
    }

    setErrorType(err);
  };

  const clearCompleted = () => {
    setContainsCompleted(false);

    todos?.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => { })
          .catch(() => setErrorType(Error.Delete));
      }
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
        setContainsCompleted(result.some(todo => todo.completed === true));
      })
      .catch(() => handleError(Error.Load));
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos ? filterTodos(todos, filterType) : null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {filteredTodos && (
          <>
            <section className="todoapp__main">
              <TodoList todos={filteredTodos} />
            </section>

            <Footer
              onFilter={setFilterType}
              filterType={filterType}
              containsCompleted={containsCompleted}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {errorType !== Error.None && (
        <ErrorMessage errorType={errorType} handleError={setErrorType} />
      )}
    </div>
  );
};
