import React, { useContext } from 'react';
import cl from 'classnames';
import { Context } from '../constext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(Context);

  const closeError = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cl(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {errorMessage}
    </div>
  );
};
