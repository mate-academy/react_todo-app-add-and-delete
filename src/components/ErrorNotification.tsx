import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: ErrorMessage | null;
  handleErrorClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  handleErrorClose,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId: ReturnType<typeof setTimeout> = setTimeout(
      handleErrorClose,
      3000,
    );

    return () => clearTimeout(timerId);
  }, [error, handleErrorClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClose}
      />
      {error && error}
    </div>
  );
};
