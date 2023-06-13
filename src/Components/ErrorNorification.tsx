/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type ErrorComponent = {
  errorType: ErrorType,
};

export const ErrorNorification: React.FC<ErrorComponent> = ({ errorType }) => {
  const [isError, setIsError] = useState(false);

  let timeOutId: NodeJS.Timeout;

  useEffect(() => {
    if (!isError) {
      timeOutId = setTimeout(() => {
        setIsError(true);
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
