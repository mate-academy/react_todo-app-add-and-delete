import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  closeErrors: (message: string) => void;
};

export const ErrorsAlerts: React.FC<Props> = React.memo(
  ({
    errorMessage,
    closeErrors,
  }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => closeErrors('')}
        />

        {errorMessage}
      </div>
    );
  },
);
