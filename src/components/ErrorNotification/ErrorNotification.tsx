/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

type Props = {
  isError: boolean;
  onCloseErrorMessage: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({
    isError,
    onCloseErrorMessage,
    errorMessage,
  }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onCloseErrorMessage}
        />

        {errorMessage}
      </div>
    );
  },
);
