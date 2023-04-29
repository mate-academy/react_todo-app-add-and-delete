import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  onCloseError: () => void,
};

export const ErrorsNotification: React.FC<Props> = ({
  error,
  onCloseError,
}) => {
  const showError = true;

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !showError },
    )}
    >
      <button
        aria-label="Close"
        type="button"
        className="delete"
        onClick={() => onCloseError()}
      />
      {error}
    </div>
  );
};
