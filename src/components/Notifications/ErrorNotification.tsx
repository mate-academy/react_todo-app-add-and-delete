import { ErrorType } from '../../types/ErrorType';
import React, { useEffect } from 'react';

interface Props {
  error: ErrorType;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  const erroHidden = error === null ? 'hidden' : '';

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [onClose, error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${erroHidden}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {error === 'load' && (
        <>
          <p>Unable to load todos</p>
          <br />
        </>
      )}

      {error === 'emptyTitle' && (
        <>
          <p>Title should not be empty</p>
          <br />
        </>
      )}

      {error === 'add' && (
        <>
          <p>Unable to add a todo</p>
          <br />
        </>
      )}

      {error === 'delete' && (
        <>
          <p>Unable to delete a todo</p>
          <br />
        </>
      )}

      {error === 'update' && (
        <>
          <p>Unable to update a todo</p>
          <br />
        </>
      )}
    </div>
  );
};
