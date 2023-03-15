/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  setError: (error: boolean) => void,
  errorMessage: string,
};

export const TodoNotification: React.FC<Props> = ({
  setError,
  errorMessage,
}) => {
  const [isError, setIsError] = useState(true);
  const deleteError = () => {
    setIsError(false);
    setTimeout(() => {
      setError(false);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      deleteError();
    }, 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={deleteError}
      />
      {errorMessage}
    </div>
  );
};
