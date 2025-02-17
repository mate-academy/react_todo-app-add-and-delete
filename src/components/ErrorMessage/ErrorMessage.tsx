import cn from 'classnames';
import { useEffect } from 'react';

type Props = {
  error: string;
  setErrorMessage: (text: string) => void;
};

const ErrorMessage: React.FC<Props> = ({ error, setErrorMessage }) => {
  useEffect(() => {
    if (error) {
      const timeOut = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timeOut);
      };
    } else {
      return;
    }
  }, [error, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {error}
    </div>
  );
};

export default ErrorMessage;
