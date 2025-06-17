import cn from 'classnames';
import { TodoError } from '../api/todos';
import { useEffect } from 'react';

const DURATION_OF_ERROR = 3000;

interface Props {
  errorMessage: TodoError | null;
  onHideErrors: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onHideErrors,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHideErrors();
    }, DURATION_OF_ERROR);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, onHideErrors]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === null,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideErrors}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
