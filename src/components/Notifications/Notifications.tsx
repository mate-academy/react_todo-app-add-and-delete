/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
  isError: boolean;
  onClose: () => void;
};

export const Notifications: React.FC<Props> = ({
  errorType,
  isError,
  onClose,
}) => {
  const errorMessage = errorType === ErrorType.Title
    ? 'Title can\'t be empty'
    : `Unable to ${errorType} a todo`;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
