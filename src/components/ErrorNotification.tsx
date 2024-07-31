import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={cn('delete', { hidden: !errorMessage })}
        onClick={() => onClose('')}
      />
      {errorMessage}
    </div>
  );
};
