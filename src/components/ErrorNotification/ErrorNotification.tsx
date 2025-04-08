import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  onErrorMessage: (key: string) => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, onErrorMessage }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onErrorMessage('')}
        />
        {errorMessage}
      </div>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
