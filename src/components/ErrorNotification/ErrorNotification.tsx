import { memo } from 'react';

type Props = {
  errorType: string,
  onErrorTypeChange: (error: string) => void,
};

export const ErrorNotification: React.FC<Props> = memo(({
  errorType,
  onErrorTypeChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error notification"
        onClick={() => onErrorTypeChange('')}
      />
      {errorType}
    </div>
  );
});
