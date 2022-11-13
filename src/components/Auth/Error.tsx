/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  hasError: boolean;
  setHasError: (status: boolean) => void;
  messageError: string;
};

export const Error: React.FC<Props> = ({
  hasError,
  setHasError,
  messageError,
}) => {
  const closeErrors = () => {
    setHasError(false);
  };

  useEffect(() => {
    setTimeout(() => setHasError(false), 3000);
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrors}
      />
      {messageError}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
