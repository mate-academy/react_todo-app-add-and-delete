import React from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  onError: (arg: string) => void;
}

export const ErrorNotifications: React.FC<Props> = ({
  error,
  onError,
}) => {
  setTimeout(() => {
    if (error) {
      onError('');
    }
  }, 3000);

  const removeError = () => onError('');

  return (
    <div
      className={cn(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={removeError}
      />

      {error}
    </div>
  );
};
