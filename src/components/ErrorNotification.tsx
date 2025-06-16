import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type ErrorNotificationProps = {
  errorMessage: ErrorMessage;
  onSetErrorMessage: (val: ErrorMessage) => void;
};

export const ErrorNotification = ({
  errorMessage,
  onSetErrorMessage,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === ErrorMessage.WithoutError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetErrorMessage(ErrorMessage.WithoutError)}
      />
      {errorMessage}
    </div>
  );
};
