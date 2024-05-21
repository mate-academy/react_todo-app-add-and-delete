import cn from 'classnames';
import { ErrorTypes } from '../../types/errorTypes';
import { useEffect } from 'react';

type Props = {
  errorMessage: ErrorTypes | null;
  setErrorMessage: (errorMessage: ErrorTypes | null) => void;
};

export const ErrorHandler: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  //   if (errorMessage) {
  //     setNotification(true);
  //   }

  //   const timer = setTimeout(() => {
  //     setErrorMessage(null);
  //     setNotification(false);
  //   }, 3000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [errorMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
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
