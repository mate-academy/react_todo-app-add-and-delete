import React, { useEffect, useState } from 'react';

type Props = {
  emptyFieldError: boolean,
};

export const ErrorNotification: React.FC<Props> = ({ emptyFieldError }) => {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);
  }, [emptyFieldError]);

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
    </>
  );
};
