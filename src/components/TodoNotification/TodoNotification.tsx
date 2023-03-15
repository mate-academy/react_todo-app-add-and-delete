/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
};

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
}) => {
  const [isError, setIsError] = useState(true);
  const deleteError = () => {
    setTimeout(() => {
      setIsError(false);
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
