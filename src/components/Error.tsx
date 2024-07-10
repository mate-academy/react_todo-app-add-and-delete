import React from 'react';
import { FC } from 'react';
type Props = {
  errorMessage: string;
  error: boolean;
  closeErrorNotification: () => void;
};
export const Error: FC<Props> = ({
  errorMessage,
  error,
  closeErrorNotification,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorNotification}
      />

      {errorMessage}
    </div>
  );
};
