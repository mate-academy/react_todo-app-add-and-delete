/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  isError: boolean;
  onHideError: () => void;
  errorType: ErrorType;
};
export const ErrorMessage: React.FC<Props> = ({
  isError,
  onHideError,
  errorType,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError },
    )}

  >
    <button
      data-cy="HideErrorButton"
      type="button"
      onClick={onHideError}
      className="delete"
    />
    {errorType}
  </div>
);
