import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  return (
    // {/* Notification is shown in case of any error */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
