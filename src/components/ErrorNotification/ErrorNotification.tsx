import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessages';

type ErrorNotificationProps = {
  errorMessage: ErrorMessage | null;
  onClearError: (errorMessage: ErrorMessage | null) => void;
};

export const ErrorNotification = ({
  errorMessage,
  onClearError,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClearError(null)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
