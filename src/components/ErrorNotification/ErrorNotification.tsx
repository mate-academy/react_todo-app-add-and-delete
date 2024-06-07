import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

export const ErrorNotification: React.FC<ErrorType> = ({
  errorMessage,
  onClearErrorMessage,
}) => {
  const defaultClassNames =
    'notification is-danger is-light has-text-weight-normal';

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(defaultClassNames, {
        hidden: !errorMessage,
      })}
    >
      <button
        onClick={onClearErrorMessage}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
