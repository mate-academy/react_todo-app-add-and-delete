import classNames from 'classnames';
import React from 'react';

type Props = {
  errorType: string;
  setErrorType: (error: string) => void;
};

export const ErrorNotes = React.memo<Props>(({
  errorType,
  setErrorType,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorType },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="label"
        onClick={() => setErrorType('')}
      />

      {errorType}
    </div>
  );
});
