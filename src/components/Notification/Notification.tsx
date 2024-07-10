import cn from 'classnames';
import { useContext } from 'react';
import { ErrorContext } from '../../context/Error.context';

export const Notification: React.FC = () => {
  const { error, clearError } = useContext(ErrorContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />

      {error}
      {/* show only one message at a time */}
      {/* Unable to update a todo */}
    </div>
  );
};
