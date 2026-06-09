import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  message: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  message,
  setErrorMessage,
}) => {
  function handleHideErrorButton() {
    setErrorMessage('');
  }

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideErrorButton}
      />
      {message}
    </div>
  );
};
