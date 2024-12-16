import React from 'react';
import cn from 'classnames';
import { Errors } from '../../utils/Errors';

interface Props {
  hasError: Errors;
  setHasError: (hasError: Errors) => void;
}
export const Error: React.FC<Props> = props => {
  const { hasError, setHasError } = props;

  return (
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
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setHasError(Errors.NoError);
        }}
      />

      {hasError}
    </div>
  );
};
