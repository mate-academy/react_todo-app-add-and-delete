import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (error: string) => void;
};

export const ErrorField = ({ errorMessage, setErrorMessage }: Props) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
