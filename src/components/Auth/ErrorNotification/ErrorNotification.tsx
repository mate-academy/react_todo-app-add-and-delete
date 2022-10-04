import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [hideError, setHideError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [hideError, errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: hideError,
          },
        )
      }
    >
      <button
        aria-label="close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHideError(true)}
      />
      { errorMessage }
    </div>
  );
};
