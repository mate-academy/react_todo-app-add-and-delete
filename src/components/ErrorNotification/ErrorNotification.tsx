import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';
type Props = {
  error: ErrorMessages | null;
  onHandleHideError: () => void;
};
export const ErrorNotification: React.FC<Props> = ({
  error,
  onHandleHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHandleHideError}
      />
      {error}
    </div>
  );
};
