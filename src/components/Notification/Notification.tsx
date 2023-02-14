import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean,
  errorMessage: string,
  onClear: () => void
};

export const Notification: React.FC<Props> = ({
  hasError,
  errorMessage,
  onClear,
}) => {
  useEffect(() => {
    setInterval(onClear, 3000);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onClear}
      />

      {errorMessage}
    </div>
  );
};
