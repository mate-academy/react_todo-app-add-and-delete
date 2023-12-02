import React from 'react';
import { useAppState } from '../AppState/AppState';

export const ErrorNotification: React.FC = () => {
  const {
    errorNotification,
    setErrorNotification,
  } = useAppState();

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorNotification ? '' : 'hidden'}`}
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
