/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
};

export const Notifications: React.FC<Props> = ({ errorType }) => {
  const isRequestError = errorType === ErrorType.ADD
    || errorType === ErrorType.DELETE
    || errorType === ErrorType.EDIT;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorType === ErrorType.NONE },
      )}
    >
      <button
        type="button"
        className="delete"
      />
      {errorType === ErrorType.TITLE && 'Title can\'t be empty'}
      {isRequestError && `Unable to ${errorType} a todo`}
    </div>
  );
};
