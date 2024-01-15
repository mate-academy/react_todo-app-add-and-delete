import { memo } from 'react';
import { Error } from '../types/Error';

interface Props {
  error: Error | null,
  close: () => void,
}

export const ErrorMessage: React.FC<Props> = memo(({ error, close }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        aria-label="Close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={close}
      />
      <p>{error}</p>
    </div>
  );
});
