import React from 'react';

import cn from 'classnames';

interface Props {
  errorMessage: string;
  clearErrorMessage: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  clearErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
