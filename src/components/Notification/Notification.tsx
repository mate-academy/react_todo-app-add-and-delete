/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
