/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { memo, useEffect } from 'react';

interface ErrorNotificationProps {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  close: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = memo(
  ({ setErrorMessage, errorMessage, close }) => {
    useEffect(() => {
      setTimeout(() => setErrorMessage(''), 3000);
    }, [setErrorMessage]);

    return (
      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={close}
        />

        {errorMessage}
      </div>
    );
  },
);
