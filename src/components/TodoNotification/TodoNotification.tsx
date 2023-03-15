/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setIsError: (error: boolean) => void,
};

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
  setIsError,
}) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout
  | undefined>(undefined);

  const deleteError = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setIsError(false);
  };

  const handleButtonClick = () => {
    deleteError();
  };

  useEffect(() => {
    const newTimeoutId = setTimeout(() => {
      deleteError();
    }, 3000);

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleButtonClick}
      />
      {errorMessage}
    </div>
  );
};
