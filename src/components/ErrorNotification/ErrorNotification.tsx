import React from 'react';
import { useTodos } from '../Context';

export const ErrorNotification: React.FC = () => {
  const {
    error,
    setError,
    errVisible,
    setErrVisible,
  } = useTodos();

  const handlerClosingError = () => {
    setError('');
    setErrVisible(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errVisible ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="btn"
        onClick={handlerClosingError}
      />
      {error}
    </div>
  );
};
