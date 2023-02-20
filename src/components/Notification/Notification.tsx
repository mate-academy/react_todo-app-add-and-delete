import { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  hasError: boolean,
  changeHasError: (value: boolean) => void,
  errorMessage: ErrorMessage | string,
};

export const Notification: React.FC<Props> = ({
  errorMessage, changeHasError, hasError,
}) => {
  useEffect(() => {
    const timerId = window.setTimeout(() => changeHasError(false), 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasError]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })}
    >
      <button
        type="button"
        className="delete"
        aria-label="close error message"
        onClick={() => changeHasError(false)}
      />

      {errorMessage}
    </div>
  );
};
