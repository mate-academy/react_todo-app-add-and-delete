import React, { useEffect, useState } from 'react';
import { ERROR } from '../../types/enums';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: ERROR) => void;
};

export const ErrorField: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (errorMessage === ERROR.default) {
      return;
    }

    setTimerId(
      setTimeout(() => {
        setErrorMessage(ERROR.default);
      }, 3000),
    );

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ErrorNotification ${!errorMessage && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(ERROR.default);
          clearTimeout(timerId);
        }}
      />
      {errorMessage}
    </div>
  );
};
