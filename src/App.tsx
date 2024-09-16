/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { USER_ID, getTodos } from './api/todos';
import { DispatchContext, StateContext } from './components/MainContext';
import { ActionTypes } from './types/ActionTypes';
import { Header } from './components/Header';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useContext(DispatchContext);
  const { todos, errorMessage } = useContext(StateContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const hasTodos = !!todos.length;

  useEffect(() => {
    getTodos()
      .then(responce =>
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            todos: responce,
          },
        }),
      )
      .catch(() =>
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            errorMessage: 'Unable to load todos',
          },
        }),
      );
  }, [dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header query={query} setQuery={setQuery} setTempTodo={setTempTodo} />

        <TodoList tempTodo={tempTodo} />

        {hasTodos && <TodoFilter />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() =>
            dispatch({
              type: ActionTypes.SetValuesByKeys,
              payload: {
                errorMessage: '',
              },
            })
          }
        />
        {errorMessage}
      </div>
    </div>
  );
};
