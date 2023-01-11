import React, { useEffect, useState } from 'react';

type Props = {
  emptyFieldError: boolean,
  failedAddError: boolean,
  failedDeleteError: boolean,
  failedLoadError: boolean,
};

export const ErrorNotification: React.FC<Props> = ({
  emptyFieldError,
  failedAddError,
  failedDeleteError,
  failedLoadError,
}) => {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);
  }, [emptyFieldError, failedAddError, failedDeleteError, failedLoadError]);

  return (
    <>
      {emptyFieldError && !closed && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setClosed(true);
            }}
          >
            Close Error
          </button>
          Title can not be empty
        </div>
      )}

      {failedAddError && !closed && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setClosed(true);
            }}
          >
            Close Error
          </button>
          Unable to add a todo
        </div>
      )}

      {failedDeleteError && !closed && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setClosed(true);
            }}
          >
            Close Error
          </button>
          Unable to delete a todo
        </div>
      )}

      {failedLoadError && !closed && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setClosed(true);
            }}
          >
            Close Error
          </button>
          Unable to load a todo
        </div>
      )}
    </>
  );
};
