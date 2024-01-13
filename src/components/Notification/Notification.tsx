import cn from 'classnames';
import { memo, useMemo } from 'react';
import { ShowError } from '../../types/ShowErrors';
import { showErrors } from '../../utils/showError';

type Props = {
  error: ShowError | null,
  hideError: () => void,
};
export const Notification: React.FC<Props> = memo(({ error, hideError }) => {
  const currentError = useMemo(
    () => error && showErrors(error),
    [error],
  );

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      <button
        className="delete"
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide-error"
        onClick={hideError}
      />
      {currentError}
    </div>
  );
});
