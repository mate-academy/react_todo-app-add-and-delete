/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  hasError: boolean,
  onErrorPresence: React.Dispatch<React.SetStateAction<boolean>>,
  errorMessage: string,
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  hasError, onErrorPresence, errorMessage, onErrorMessage,
}) => {
  useEffect(() => {
    if (hasError) {
      setTimeout(() => {
        onErrorPresence(false);
        onErrorMessage('');
      }, 3000);
    }
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorPresence(false)}
      />

      {errorMessage}
    </div>
  );
});
