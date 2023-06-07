/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorType: ErrorType;
  onCloseNotification: () => void;
};

export const Notification: React.FC<Props> = ({
  errorType,
  onCloseNotification,
}) => {
  const getErrorMessage = () => {
    switch (errorType) {
      case ErrorType.onLoad:
        return 'Unable to load the todos';

      case ErrorType.onAdd:
        return 'Unable to add a todo';

      case ErrorType.onDelete:
        return 'Unable to delete a todo';

      case ErrorType.onUpdate:
        return 'Unable to update a todo';

      case ErrorType.missingTitle:
        return "Title can't be empty";

      case ErrorType.none:
      default:
        return '';
    }
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: errorType === ErrorType.none },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseNotification}
      />

      {errorMessage}
    </div>
  );
};
