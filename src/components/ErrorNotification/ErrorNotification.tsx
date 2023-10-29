import cn from 'classnames';
import React, { useContext } from 'react';
import { ErrorContext } from '../../ErrorContext';

export const ErrorNotification: React.FC = () => {
  const {
    error,
    setError,
  } = useContext(ErrorContext);

  const handleHideErrorClick = () => {
    setError('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        cn('notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        })
      }
    >
      <button
        data-cy="HideErrorButton"
        aria-label="title"
        type="button"
        className="delete"
        onClick={handleHideErrorClick}
      />
      {error}
    </div>
  );
};
