import React from 'react';
import classNames from 'classnames';
import { useAppState } from '../AppState/AppState';

export const ErrorNotification: React.FC = () => {
  const {
    errorNotification,
    setErrorNotification,
  } = useAppState();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorNotification,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorNotification(null)}
        aria-labelledby="button delete"
      />
      {errorNotification}
    </div>
  );
};
