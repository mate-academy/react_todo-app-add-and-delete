import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../../types/Enums';

type Props = {
  errorMessage: ErrorMessage | null,
  isError: boolean,
  setIsError: (value: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isError,
  setIsError,
}) => {
  useEffect(() => {
    const hideMessage = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => {
      clearInterval(hideMessage);
    };
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => setIsError(false)}
      />

      {errorMessage}
    </div>
  );
};
