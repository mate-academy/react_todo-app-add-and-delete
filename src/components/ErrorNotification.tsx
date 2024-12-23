import cn from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: string;
  setErrorMessage: (error: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { error, setErrorMessage } = props;

  useEffect(() => {
    if (error === ErrorMessage.Default) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage}
      />
      {error}
    </div>
  );
};
