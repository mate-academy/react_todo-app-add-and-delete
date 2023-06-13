import React from 'react';
import cn from 'classnames';

interface Props {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => onClose()}
      />

      {error}
    </div>
  );
});
