import cn from 'classnames';
import { memo } from 'react';
import { ErrorType } from '../types/errors-enum';

interface Props {
  error: ErrorType | null,
  onCloseError: (type: ErrorType | null) => void,
}

export const Notification: React.FC<Props> = memo(({ error, onCloseError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="hide error button"
      onClick={() => onCloseError(null)}
    />
    {error}
  </div>
));
