import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  isError: boolean;
  onCloseErrorMessage: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const {
    isError,
    onCloseErrorMessage,
    errorMessage,
  } = props;

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
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrorMessage}
      />

      {errorMessage}
    </div>
  );
});
