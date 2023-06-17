/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type ErrorComponent = {
  errorType: ErrorType,
  resetError: (error: ErrorType) => void,
};

export const ErrorNorification: React.FC<ErrorComponent> = ({
  errorType,
  resetError,
}) => {
  const [isError, setIsError] = useState(false);

  let timeOutId: NodeJS.Timeout;

  useEffect(() => {
    if (!isError) {
      timeOutId = setTimeout(() => {
        setIsError(true);
        resetError(ErrorType.none);
      }, 3000);
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);

  const handleCLearErrorBtn = () => {
    setIsError(true);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: isError,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCLearErrorBtn}
      />
      {errorType}
    </div>
  );
};
