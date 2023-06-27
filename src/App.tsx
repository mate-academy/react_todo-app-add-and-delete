/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Form } from './components/form';
import { TodosFooter } from './components/todosFooter';
import { Todos } from './components/todos';
import { ErrorType } from './types/Error';
import { FilterType } from './types/Filter';

const USER_ID = 10378;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.NONE);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res.slice(0)))
      .catch(() => setErrorType(ErrorType.LOAD));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, [errorType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          { todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every((todo) => todo.completed),
              })}
            />
          )}

          <Form
            todos={todos}
            setTodos={setTodos}
            setErrorType={setErrorType}
            USER_ID={USER_ID}
          />
        </header>

        <section className="todoapp__main">
          <Todos
            todos={todos}
            filterType={filterType}
            setErrorType={setErrorType}
            setTodos={setTodos}
          />
        </section>

        <TodosFooter
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          setTodos={setTodos}
        />
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorType(ErrorType.NONE)}
        />
        {errorType === ErrorType.LOAD && 'Unable to load todos'}
        {errorType === ErrorType.ADD && 'Unable to add a todo'}
        {errorType === ErrorType.DELETE && 'Unable to delete a todo'}
        {errorType === ErrorType.UPDATE && 'Unable to update a todo '}
      </div>
    </div>
  );
};
