/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  onCloseError: () => void;
}

export const Error: React.FC<Props> = ({ errorMessage, onCloseError }) => {
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
        className="delete"
        onClick={onCloseError}
      />
      {errorMessage}
    </div>
  );
};
