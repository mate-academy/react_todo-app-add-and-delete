/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useRef } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const message = useRef(errorMessage);

  if (errorMessage) {
    message.current = errorMessage;
    setTimeout(() => setErrorMessage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          ['notification is-danger is-light has-text-weight-normal'],
          { hidden: errorMessage === '' },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {message.current}
    </div>
  );
};
