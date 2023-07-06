/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage,
  handleCloseError: () => void,
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  handleCloseError,
}) => {
  useEffect(() => {
    const delay = setTimeout(() => {
      handleCloseError();
    }, 3000);

    return () => {
      clearTimeout(delay);
    };
  }, [handleCloseError]);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={handleCloseError}
      />
      {errorMessage}
    </div>
  );
};
