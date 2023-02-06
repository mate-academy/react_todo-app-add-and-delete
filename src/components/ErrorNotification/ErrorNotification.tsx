import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string,
  onCloseErrorMessage: () => void;
  isError: boolean,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
  isError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrorMessage}
      />

      {errorMessage}
    </div>
  );
};
