/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
  isErrorShown: boolean;
  onCloseClick: () => void;
};

export const Notifications: React.FC<Props> = ({
  errorType,
  isErrorShown,
  onCloseClick,
}) => {
  const errorMessage = errorType === ErrorType.TITLE
    ? 'Title can\'t be empty'
    : `Unable to ${errorType} a todo`;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isErrorShown },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseClick}
      />
      {errorMessage}
    </div>
  );
};
