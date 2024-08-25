import classNames from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  message: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  message,
  setErrorMessage,
}) => {
  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      timerId.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [message, setErrorMessage]);

  useEffect(() => {
    return () => {
      clearTimeout(timerId.current);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      {message}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
    </div>
  );
};
