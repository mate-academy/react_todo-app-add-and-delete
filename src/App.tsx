/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import './styles/todoapp.scss';
import classNames from 'classnames';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  const [error, setError] = useState('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoApp setError={prev => setError(prev)} />

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
