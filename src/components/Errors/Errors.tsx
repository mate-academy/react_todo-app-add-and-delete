import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  onErrorsChange: (value: ErrorMessage) => void,
  visibleError: ErrorMessage,
}

export const Errors: React.FC<Props> = (
  {
    onErrorsChange,
    visibleError,
  },
) => {
  useEffect(() => {
    setTimeout(() => onErrorsChange(ErrorMessage.None), 3000);
  }, []);

  const closeOutErrors = useCallback(
    () => {
      onErrorsChange(ErrorMessage.None);
    },
    [visibleError],
  );

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !visibleError,
        },
      )}
    >
      <button
        aria-label="Delete error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeOutErrors}
      />
      {visibleError}
    </div>
  );
};
