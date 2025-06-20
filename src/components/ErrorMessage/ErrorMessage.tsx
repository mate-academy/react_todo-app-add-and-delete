import React from 'react';
import classNames from 'classnames';

type ErrorMessageProps = {
  errorMessage: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = React.memo(
  ({ errorMessage }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    );
  },
);

ErrorMessage.displayName = 'ErrorMessage';
