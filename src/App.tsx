/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorContext, ErrorsMessageContext } from './components/ErrorsContext';
import { ShowErrorsMessage } from './utils/fetchClient';
import { IsfinallyContext } from './components/TempTodoContext';

const USER_ID = 11969;

// 11969
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { isError, setIsError } = useContext(ErrorContext);
  const { errorsMesage, setErrorsMesage } = useContext(ErrorsMessageContext);
  const [filter, setFilter] = useState('All');
  const { isfinally } = useContext(IsfinallyContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setIsError(true);
        setErrorsMesage('load');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isfinally]);

  return (
    <div className="todoapp">

      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header todos={todos} />
        <TodoList
          todos={todos}
          filter={filter}
        />

        {(todos.length > 0) && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
          />
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: !isError })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onMouseDown={() => {
            setIsError(false);
          }}
        />
        {ShowErrorsMessage(errorsMesage)}
      </div>
    </div>
  );
};
