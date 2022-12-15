import React from 'react';
import { Error } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  error: Error;
  onErrorChange: (value: Error) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onErrorChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorChange(Error.None)}
      />

      {error}
    </div>
  );
};
