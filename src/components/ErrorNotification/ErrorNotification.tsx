import React, { memo } from 'react';
import cn from 'classnames';

interface Props {
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
}

export const ErrorNotification: React.FC<Props> = memo(({
  hasError,
  setHasError,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />

      {errorMessage}
    </div>
  );
});
