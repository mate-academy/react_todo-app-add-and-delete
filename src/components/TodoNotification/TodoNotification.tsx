/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setIsError: (error: boolean) => void,
};

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
  setIsError,
}) => {
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const deleteError = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setIsError(false);
  };

  const handleButtonClick = () => {
    deleteError();
  };

  useEffect(() => {
    timeoutIdRef.current = setTimeout(() => {
      deleteError();
    }, 3000);

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
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
