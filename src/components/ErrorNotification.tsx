import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: string;
  setErrorMessage: (v: ErrorMessage) => void;
};

export const ErrorNotification = ({ errorMessage, setErrorMessage }: Props) => {
  useEffect(() => {
    const id = setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, [setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames([
        'notification',
        'is-danger',
        'is-light',
        ' has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      ])}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.Default)}
      />
      {errorMessage}
    </div>
  );
};
