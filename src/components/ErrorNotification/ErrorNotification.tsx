/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (err: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: !errorMessage,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
