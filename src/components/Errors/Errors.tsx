import React, { memo, useEffect } from 'react';
import cn from 'classnames';

type ErrorsProps = {
  message: string;
  onHideError: React.Dispatch<React.SetStateAction<string>>;
};

export const Errors: React.FC<ErrorsProps> = memo(({
  message,
  onHideError,
}) => {
  useEffect(() => {
    setTimeout(() => onHideError(''), 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onHideError('')}
      />
      {message}
    </div>
  );
});
