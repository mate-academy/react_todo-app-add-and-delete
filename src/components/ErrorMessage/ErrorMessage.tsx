import { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  error: string;
  onCloseError?: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  error,
  onCloseError = () => { },
}) => {

  useEffect(() => {
    const timerId = setTimeout(() => {
      onCloseError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [onCloseError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { "hidden": (!error || error.trim() === '') },
      )}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseError()}
      />
      {error}
    </div>
  );
};
