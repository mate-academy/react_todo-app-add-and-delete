import React from 'react';
import cn from 'classnames';
import { ErrorHandler } from '../../types/ErrorHandler';

interface Props {
  hasError: ErrorHandler
  hideError: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  hideError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !hasError },
    )}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={hideError}
    />

    {hasError}
  </div>
);
