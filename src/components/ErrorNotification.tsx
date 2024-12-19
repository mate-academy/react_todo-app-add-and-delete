import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';
import { Dispatch, SetStateAction, useEffect } from 'react';

type Props = {
  errorMessage: ErrorTypes | null;
  setErrorMessage: Dispatch<SetStateAction<ErrorTypes | null>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage === null) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
