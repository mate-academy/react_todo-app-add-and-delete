import React from 'react';

import cn from 'classnames';

import { Errors } from '../../types/Errors';

interface Props {
  errorMessage: Errors | null;
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
