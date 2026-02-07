import './ErrorNotification.scss';

import React from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  onClear: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClear,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: errorMessage.length === 0,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {errorMessage}
    </div>
  );
};
