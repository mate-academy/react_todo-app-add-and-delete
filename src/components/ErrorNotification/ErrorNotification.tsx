import classNames from 'classnames';
import { ErrorData } from '../../types/ErrorData';

type Props = {
  isError: ErrorData,
  onResetError: () => void,
};

export const ErrorNotify: React.FC<Props> = ({
  isError,
  onResetError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isError.status },
    )}
  >
    <button
      aria-label="button"
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onResetError}
    />
    {isError.notification}
  </div>
);
