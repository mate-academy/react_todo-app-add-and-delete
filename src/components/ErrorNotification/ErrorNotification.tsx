import cn from 'classnames';
import React from 'react';

interface Props {
  error: string,
  closeNotification: () => void,
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  closeNotification,
}) => {
  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <div className="notification is-danger is-light has-text-weight-normal">
        <button
          type="button"
          className="delete"
          aria-label="delete button"
          onClick={closeNotification}
        />
        {error}
      </div>
    </div>
  );
};
