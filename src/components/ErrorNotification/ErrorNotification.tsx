import cn from 'classnames';
import { memo } from 'react';
import { ShowError } from '../../types/ShowErrors';
import { showErrors } from '../../_utils/showError';

type Props = {
  error: ShowError | null,
  hideError: () => void,
};

export const Notification: React.FC<Props> = memo(({ error, hideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        className="delete"
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide-error"
        onClick={hideError}
      />
      {error && showErrors(error)}
    </div>
  );
});
