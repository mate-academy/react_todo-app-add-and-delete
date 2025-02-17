import React from 'react';
import classNames from 'classnames';
import { useTodosContext } from './useTodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, handleError, setIsInputFocused } = useTodosContext();

  const handleErrorButton = () => {
    handleError('');
    setIsInputFocused(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorButton}
      />
      {errorMessage}
    </div>
  );
};
