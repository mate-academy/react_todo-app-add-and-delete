/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext } from 'react';
import { GlobalContex } from '../TodoContext';

export const Errors: React.FC = () => {
  const { error, setError } = useContext(GlobalContex);

  return (
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
      <p>{error}</p>
    </div>
  );
};
