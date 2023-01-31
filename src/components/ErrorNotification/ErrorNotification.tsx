import React, { memo, useEffect } from 'react';
import { Errors } from '../../types/Error';

interface Props {
  message: Errors,
  setMessage: (message: Errors) => void,
}

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const {
    message,
    setMessage,
  } = props;

  useEffect(() => {
    setTimeout(() => {
      setMessage(Errors.None);
    }, 3000);
  }, [setMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setMessage(Errors.None)}
      />
      {message}
    </div>
  );
});
