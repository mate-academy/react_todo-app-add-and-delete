import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  onErrorMessage: (message: string) => void;
}

export const ErrorMessage: React.FC<Props> = React.memo(
  function ErrorMessageComponent({ errorMessage, onErrorMessage }) {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete hidden"
          onClick={() => onErrorMessage('')}
        />
        {errorMessage}
      </div>
    );
  },
);
